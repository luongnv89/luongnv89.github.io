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

# ── SSH auth for push (use the portfolio deploy key if present) ────────────────
if [[ -z "${GIT_SSH_COMMAND:-}" ]]; then
  if [[ -f "$HOME/.ssh/blogs_deploy" ]]; then
    export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/blogs_deploy -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
  else
    export GIT_SSH_COMMAND="ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
  fi
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
git fetch origin
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

  if ! git push origin "${BRANCH}"; then
    echo "[WARN] Push rejected (non-fast-forward); resetting and retrying once"
    git fetch origin
    git reset --hard "origin/${BRANCH}"
    node scripts/update-stats.js
    if ! git diff --quiet -- "${DATA_FILES[@]}"; then
      git add "${DATA_FILES[@]}"
      git commit -m "chore(portfolio): update GitHub stats"
      git push origin "${BRANCH}"
    else
      echo "[OK] No net change after retry"
    fi
  fi
  echo "[OK] Pushed updated GitHub stats"
else
  echo "[OK] No changes to project data files"
fi
