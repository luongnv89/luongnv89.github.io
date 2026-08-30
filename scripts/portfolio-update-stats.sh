#!/usr/bin/env bash
#
# portfolio-update-stats.sh
# ─────────────────────────────────────────────────────────────────────────────
# Daily GitHub-stats updater for luongnv89.github.io.
#
# This is the entry point referenced by the Hermes cron job
# `portfolio-github-stats-daily` (script: "portfolio-update-stats.sh",
# resolved from ~/.hermes/scripts/). It is symlinked there from this repo so
# the two stay in sync.
#
# What it does:
#   1. Locks itself with flock (no overlapping runs).
#   2. Resolves auth (gh CLI token, fallback to ~/.config/devstats/api.env).
#   3. Hard-resets the repo to origin/main (GitHub is source of truth for this
#      generated repo) and cleans untracked junk (keeping logs/node_modules).
#   4. Runs scripts/update-stats.js (Node stdlib only — no npm install needed).
#   5. Commits + pushes src/data/projects.json + portfolio.json ONLY if changed.
#
# Everything written to stdout becomes the Telegram message the cron delivers.

set -euo pipefail

# ── Diagnostics (surfaces cron-env failures; written to a REAL, readable path) ──
DIAG="/home/omachi/workspace/luongnv89.github.io/logs/cron-diag.log"
mkdir -p "$(dirname "$DIAG")"
{
  echo "[diag $(date -u +%Y-%m-%dT%H:%M:%SZ)] whoami=$(whoami) HOME=$HOME SSH_AUTH_SOCK=${SSH_AUTH_SOCK:-<unset>}"
  echo "[diag] PATH=$PATH"
  echo "[diag] GIT_SSH_COMMAND=${GIT_SSH_COMMAND:-<unset>}"
  id 2>/dev/null
} > "$DIAG" 2>&1 || true

# Surface the failing command on any error (also appended to the diag log).
trap 'echo "[FAIL] command failed: $BASH_COMMAND (line $LINENO)"; echo "[FAIL] whoami=$(whoami) HOME=$HOME SSH_AUTH_SOCK=${SSH_AUTH_SOCK:-<unset>} GIT_SSH_COMMAND=${GIT_SSH_COMMAND:-<unset>}" >> "$DIAG" 2>&1' ERR

# Retry a command up to N times on transient failure (network/API blips) so a
# single flaky call during the scheduled run doesn't fail the whole cron job.
retry() {
  local max="$1"; shift
  local attempt
  for attempt in $(seq 1 "$max"); do
    if "$@"; then
      return 0
    fi
    echo "[RETRY] '$*' failed (attempt $attempt/$max); backing off 20s" >&2
    sleep 20
  done
  return 1
}

# ── Locate this script (follow symlink so it works from ~/.hermes/scripts) ──────
SRC="${BASH_SOURCE[0]}"
if [[ -L "$SRC" ]]; then
  SRC="$(readlink -f "$SRC")"
fi
SCRIPT_DIR="$(cd "$(dirname "$SRC")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

BRANCH="main"
LOG_DIR="$REPO_DIR/logs"
LOCK_FILE="$LOG_DIR/update-stats.lock"
DATA_FILES=(src/data/projects.json src/data/portfolio.json)
ENV_FILE="${DEVSTATS_ENV_FILE:-$HOME/.config/devstats/api.env}"

# ── Toolchain PATH (mise-managed node + gh) ────────────────────────────────────
export PATH="$HOME/.local/share/mise/shims:$HOME/.local/share/mise/installs/node/26.7.0/bin:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"

# ── SSH auth for push ──────────────────────────────────────────────────────────
# Prefer the blogs_deploy key ONLY when an ssh-agent is available to supply its
# passphrase. The cron scheduler runs detached without SSH_AUTH_SOCK, where an
# encrypted key is unusable and the push would fail. In that case fall back to
# the default (passwordless) SSH key, which works without an agent.
if [[ -n "${SSH_AUTH_SOCK:-}" && -f "$HOME/.ssh/blogs_deploy" ]]; then
  export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/blogs_deploy -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
else
  export GIT_SSH_COMMAND="ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
fi

# ── Single-instance lock ────────────────────────────────────────────────────────
mkdir -p "$LOG_DIR"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "[SKIP] Another update-stats run is already in progress"
  exit 0
fi

# ── Auth resolution ─────────────────────────────────────────────────────────────
AUTH_SOURCE="unauthenticated"
if command -v gh >/dev/null 2>&1; then
  if GH_TOKEN="$(gh auth token 2>/dev/null)" && [[ -n "$GH_TOKEN" ]]; then
    export GITHUB_TOKEN="$GH_TOKEN"
    AUTH_SOURCE="gh CLI"
  fi
fi
if [[ "$AUTH_SOURCE" != "gh CLI" && -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
  AUTH_SOURCE="env file"
fi

echo "[AUTH] Using ${AUTH_SOURCE} authentication"
echo "[REPO] ${REPO_DIR} (branch ${BRANCH})"

cd "$REPO_DIR"

# Recover from any stale in-progress git state
git rebase --abort >/dev/null 2>&1 || true
git merge --abort  >/dev/null 2>&1 || true

# Treat GitHub as source of truth for this generated repo
retry 3 git fetch origin
git reset --hard "origin/${BRANCH}"
git clean -fd -e logs -e node_modules

# Run the worker (Node stdlib only — no npm install required).
# Retry on transient GitHub API / network failures so a single flaky call
# (rate-limit, timeout, intermittent auth) doesn't fail the whole cron run.
run_worker() {
  local attempt
  for attempt in 1 2 3; do
    if node scripts/update-stats.js; then
      return 0
    fi
    echo "[RETRY] update-stats.js failed (attempt $attempt/3); backing off 30s" >&2
    sleep 30
  done
  return 1
}
run_worker

# Commit + push only if the data files actually changed
if ! git diff --quiet -- "${DATA_FILES[@]}"; then
  git add "${DATA_FILES[@]}"
  git commit -m "chore(portfolio): update GitHub stats"

  if ! retry 3 git push origin "${BRANCH}"; then
    # Last-resort: reset to remote and re-run once more before giving up.
    git fetch origin
    git reset --hard "origin/${BRANCH}"
    node scripts/update-stats.js
    if ! git diff --quiet -- "${DATA_FILES[@]}"; then
      git add "${DATA_FILES[@]}"
      git commit -m "chore(portfolio): update GitHub stats"
      retry 3 git push origin "${BRANCH}"
    else
      echo "[OK] No net change after retry"
    fi
  fi
  echo "[OK] Pushed updated GitHub stats"
else
  echo "[OK] No changes to project data files"
fi
