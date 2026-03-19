#!/usr/bin/env bash
set -euo pipefail

# Update portfolio stats (stars, followers, total stars) and push if changed.
# Uses GITHUB_TOKEN from ~/.config/devstats/api.env to avoid duplicating secrets.
# Hardened for cron usage:
# - prevent overlapping runs with flock
# - rebase onto latest origin/master before updating
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

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

export GIT_SSH_COMMAND="$SSH_CMD"

cd "$REPO_DIR"

# Ensure deps (assumes already installed; uncomment if needed)
# npm ci

git fetch origin
git pull --rebase --autostash origin master

npm run update-stats

if ! git diff --quiet -- src/data/projects.json; then
  git add src/data/projects.json
  git commit -m "chore(portfolio): update GitHub stats"

  if ! git push origin master; then
    echo "[WARN] Push rejected; rebasing onto latest origin/master and retrying once"
    git fetch origin
    git pull --rebase --autostash origin master
    git push origin master
  fi
else
  echo "[OK] No changes to projects.json"
fi
