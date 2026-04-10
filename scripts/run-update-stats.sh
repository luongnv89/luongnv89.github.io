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

ENV_FILE="$HOME/.config/devstats/api.env"
REPO_DIR="/home/luongnv/workspace/luongnv89.github.io"
LOG_DIR="$REPO_DIR/logs"
LOCK_FILE="$LOG_DIR/update-stats.lock"
SSH_CMD="ssh -i /home/luongnv/.ssh/blogs_deploy -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"

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
  source "$ENV_FILE"
  set +a
  AUTH_SOURCE="env"
fi

export GIT_SSH_COMMAND="$SSH_CMD"
echo "[AUTH] Using ${AUTH_SOURCE} authentication"

cd "$REPO_DIR"

# Ensure deps (assumes already installed; uncomment if needed)
# npm ci

(git rebase --abort || true)
(git merge --abort || true)

git fetch origin
git reset --hard origin/master
git clean -fd logs

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
