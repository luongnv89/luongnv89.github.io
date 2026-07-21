#!/usr/bin/env bash
set -euo pipefail

# Update portfolio stats (stars, followers, total stars) and push if changed.
# Auth priority:
# 1) `gh auth token` from the machine's GitHub CLI session
# 2) fallback GITHUB_TOKEN from ~/.config/devstats/api.env
# Hardened for cron usage:
# - prevent overlapping runs with flock
# - recover from stale conflict/rebase state
# - treat GitHub/master as source of truth for this generated repo
# - retry once if push is rejected by a non-fast-forward

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${DEVSTATS_ENV_FILE:-$HOME/.config/devstats/api.env}"
LOG_DIR="$REPO_DIR/logs"
LOCK_FILE="$LOG_DIR/update-stats.lock"

# Prefer an explicit deploy key if present; otherwise use the user's default SSH agent/key.
if [[ -n "${GIT_SSH_COMMAND:-}" ]]; then
  :
elif [[ -f "${HOME}/.ssh/blogs_deploy" ]]; then
  export GIT_SSH_COMMAND="ssh -i ${HOME}/.ssh/blogs_deploy -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
else
  export GIT_SSH_COMMAND="ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
fi

mkdir -p "$LOG_DIR"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "[SKIP] Another update-stats run is already in progress"
  exit 0
fi

AUTH_SOURCE="unauthenticated"

if command -v gh >/dev/null 2>&1; then
  if GH_TOKEN="$(gh auth token 2>/dev/null)" && [[ -n "$GH_TOKEN" ]]; then
    export GITHUB_TOKEN="$GH_TOKEN"
    AUTH_SOURCE="gh"
  fi
fi

if [[ "$AUTH_SOURCE" != "gh" && -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
  AUTH_SOURCE="env"
fi

export PATH="${HOME}/.local/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"
echo "[AUTH] Using ${AUTH_SOURCE} authentication"
echo "[REPO] ${REPO_DIR}"

cd "$REPO_DIR"

# Ensure deps once if missing (safe for fresh clones on a new host)
if [[ ! -d node_modules ]]; then
  echo "[DEPS] Installing npm dependencies"
  npm ci || npm install
fi

(git rebase --abort >/dev/null 2>&1 || true)
(git merge --abort >/dev/null 2>&1 || true)

git fetch origin
git reset --hard origin/master
# Keep local logs; only clean other untracked junk if needed
git clean -fd -e logs -e node_modules

npm run update-stats

if ! git diff --quiet -- src/data/projects.json src/data/portfolio.json; then
  git add src/data/projects.json src/data/portfolio.json
  git commit -m "chore(portfolio): update GitHub stats"

  if ! git push origin master; then
    echo "[WARN] Push rejected; resetting to latest origin/master and retrying once"
    git fetch origin
    git reset --hard origin/master
    npm run update-stats
    if ! git diff --quiet -- src/data/projects.json src/data/portfolio.json; then
      git add src/data/projects.json src/data/portfolio.json
      git commit -m "chore(portfolio): update GitHub stats"
      git push origin master
    else
      echo "[OK] No changes after retry"
    fi
  fi
else
  echo "[OK] No changes to project data files"
fi
