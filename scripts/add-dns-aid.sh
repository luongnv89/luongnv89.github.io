#!/usr/bin/env bash
# add-dns-aid.sh — Add DNS for AI Discovery (DNS-AID) SVCB records to Cloudflare
#
# Prerequisites:
#   - CLOUDFLARE_API_TOKEN env var set with a Cloudflare API token
#   - CLOUDFLARE_ZONE_ID env var set (or pass --zone-id)
#   - CLOUDFLARE_DOMAIN env var set (default: luongnv.com)
#
# Usage:
#   CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ZONE_ID=xxx bash scripts/add-dns-aid.sh
#   CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ZONE_ID=xxx bash scripts/add-dns-aid.sh --domain example.com

set -euo pipefail

DOMAIN="${CLOUDFLARE_DOMAIN:-luongnv.com}"
ZONE_ID=""
API_TOKEN="${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is required}"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --zone-id) ZONE_ID="$2"; shift 2 ;;
    --domain) DOMAIN="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [ -z "$ZONE_ID" ]; then
  # Try to get zone ID from API
  ZONE_ID=$(curl -s -H "Authorization: Bearer $API_TOKEN" \
    "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" \
    | python3 -c "import json,sys; print(json.load(sys.stdin)['result'][0]['id'])" 2>/dev/null)
  if [ -z "$ZONE_ID" ]; then
    echo "Error: Could not find zone ID for $DOMAIN"
    echo "Set CLOUDFLARE_ZONE_ID or pass --zone-id"
    exit 1
  fi
fi

echo "Adding DNS-AID SVCB records for $DOMAIN (zone: $ZONE_ID)"

# Create DNS-AID records
# These records allow agents to discover AI capabilities via DNS
RECORDS=(
  '_a2a._agents'
  '_index._agents'
  '_mcp._agents'
)

for prefix in "${RECORDS[@]}"; do
  FULL_NAME="${prefix}.${DOMAIN}"
  echo "Creating SVCB record for $FULL_NAME..."

  # Create the SVCB record
  RESPONSE=$(curl -s -X POST \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{
      \"type\": \"SVCB\",
      \"name\": \"${prefix}.${DOMAIN}\",
      \"content\": \"1 . alpn=\\\"mcp\\\" port=443\",
      \"ttl\": 3600,
      \"proxied\": false
    }")

  STATUS=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin)['success'])" 2>/dev/null || echo "false")
  if [ "$STATUS" = "True" ]; then
    echo "  ✓ Created SVCB record for $FULL_NAME"
  else
    echo "  ✗ Failed to create SVCB record for $FULL_NAME"
    echo "  Response: $RESPONSE"
  fi
done

echo ""
echo "DNS-AID records added. Verify at:"
for prefix in "${RECORDS[@]}"; do
  echo "  dig SVCB ${prefix}.${DOMAIN} +short"
done
echo ""
echo "Then re-scan https://luongnv.com at isitagentready.com"
