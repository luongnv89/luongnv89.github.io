#!/usr/bin/env bash
set -euo pipefail

# Install a user crontab entry to update portfolio stats daily.
# Schedule defaults to 01:00 UTC (so it runs before DevStats at 02:00 UTC).

CRON_SCHEDULE=${CRON_SCHEDULE:-"0 1 * * *"}
CMD="/home/luongnv/workspace/luongnv89.github.io/scripts/run-update-stats.sh >> /home/luongnv/workspace/luongnv89.github.io/logs/update-stats.log 2>&1"

mkdir -p /home/luongnv/workspace/luongnv89.github.io/logs

TMP=$(mktemp)
crontab -l 2>/dev/null | grep -v 'scripts/run-update-stats.sh' > "$TMP" || true

echo "${CRON_SCHEDULE} ${CMD}" >> "$TMP"
crontab "$TMP"
rm -f "$TMP"

echo "[OK] Installed cron: ${CRON_SCHEDULE} ${CMD}"
