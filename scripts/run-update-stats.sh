#!/usr/bin/env bash
set -euo pipefail

# Update portfolio stats (stars, followers, total stars) and push if changed.
# Uses GITHUB_TOKEN from ~/.config/devstats/api.env to avoid duplicating secrets.

ENV_FILE="$HOME/.config/devstats/api.env"
REPO_DIR="/home/luongnv/workspace/luongnv89.github.io"
LOG_DIR="$REPO_DIR/logs"

mkdir -p "$LOG_DIR"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

cd "$REPO_DIR"

# Ensure deps (assumes already installed; uncomment if needed)
# npm ci

npm run update-stats

if ! git diff --quiet -- src/data/projects.json; then
  git add src/data/projects.json
  git commit -m "chore(portfolio): update GitHub stats" || true

  # Push using the configured SSH key for workspace repos
  GIT_SSH_COMMAND="ssh -i /home/luongnv/.ssh/blogs_deploy -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" \
    git push
else
  echo "[OK] No changes to projects.json"
fi
