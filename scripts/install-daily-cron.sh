#!/usr/bin/env bash
set -euo pipefail

# Install a user crontab entry to update portfolio stats daily.
# Schedule defaults to 01:00 UTC (so it runs before DevStats at 02:00 UTC).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CRON_SCHEDULE=${CRON_SCHEDULE:-"0 1 * * *"}
LOG_DIR="$REPO_DIR/logs"
CMD="${REPO_DIR}/scripts/run-update-stats.sh >> ${LOG_DIR}/update-stats.log 2>&1"

mkdir -p "$LOG_DIR"

TMP=$(mktemp)
crontab -l 2>/dev/null | grep -v 'scripts/run-update-stats.sh' > "$TMP" || true

echo "${CRON_SCHEDULE} ${CMD}" >> "$TMP"
crontab "$TMP"
rm -f "$TMP"

echo "[OK] Installed cron: ${CRON_SCHEDULE} ${CMD}"
crontab -l | grep 'scripts/run-update-stats.sh' || true
