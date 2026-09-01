#!/usr/bin/env bash
# verify-games-seo.sh — Verify SEO meta tags on all game pages in dist/games/
# Usage: ./scripts/verify-games-seo.sh
# Exit 0 if all games have required SEO tags, exit 1 otherwise.

set -euo pipefail

DIST_GAMES="dist/games"
ERRORS=0
TOTAL=0

if [ ! -d "$DIST_GAMES" ]; then
  echo "ERROR: $DIST_GAMES directory not found. Run 'npm run build' first."
  exit 1
fi

for game_dir in "$DIST_GAMES"/*/; do
  [ -d "$game_dir" ] || continue
  idx_html="$game_dir/index.html"
  [ -f "$idx_html" ] || continue

  TOTAL=$((TOTAL + 1))
  slug=$(basename "$game_dir")

  # Check required SEO tags
  has_title=$(grep -c '<title>' "$idx_html" 2>/dev/null || true)
  has_desc=$(grep -c 'name="description"' "$idx_html" 2>/dev/null || true)
  has_canonical=$(grep -c 'rel="canonical"' "$idx_html" 2>/dev/null || true)
  has_og_title=$(grep -c 'property="og:title"' "$idx_html" 2>/dev/null || true)
  has_og_desc=$(grep -c 'property="og:description"' "$idx_html" 2>/dev/null || true)
  has_og_image=$(grep -c 'property="og:image"' "$idx_html" 2>/dev/null || true)
  has_og_url=$(grep -c 'property="og:url"' "$idx_html" 2>/dev/null || true)
  has_og_type=$(grep -c 'property="og:type"' "$idx_html" 2>/dev/null || true)
  has_tw_card=$(grep -c 'name="twitter:card"' "$idx_html" 2>/dev/null || true)
  has_tw_title=$(grep -c 'name="twitter:title"' "$idx_html" 2>/dev/null || true)
  has_tw_desc=$(grep -c 'name="twitter:description"' "$idx_html" 2>/dev/null || true)
  has_tw_image=$(grep -c 'name="twitter:image"' "$idx_html" 2>/dev/null || true)

  missing=()
  [ "$has_title" -eq 0 ] && missing+=("title")
  [ "$has_desc" -eq 0 ] && missing+=("meta description")
  [ "$has_canonical" -eq 0 ] && missing+=("canonical URL")
  [ "$has_og_title" -eq 0 ] && missing+=("og:title")
  [ "$has_og_desc" -eq 0 ] && missing+=("og:description")
  [ "$has_og_image" -eq 0 ] && missing+=("og:image")
  [ "$has_og_url" -eq 0 ] && missing+=("og:url")
  [ "$has_og_type" -eq 0 ] && missing+=("og:type")
  [ "$has_tw_card" -eq 0 ] && missing+=("twitter:card")
  [ "$has_tw_title" -eq 0 ] && missing+=("twitter:title")
  [ "$has_tw_desc" -eq 0 ] && missing+=("twitter:description")
  [ "$has_tw_image" -eq 0 ] && missing+=("twitter:image")

  if [ ${#missing[@]} -gt 0 ]; then
    echo "FAIL: $slug — missing: ${missing[*]}"
    ERRORS=$((ERRORS + 1))
  else
    echo "OK: $slug — all SEO tags present"
  fi
done

echo ""
echo "Results: $TOTAL games checked, $ERRORS failures"

if [ "$ERRORS" -gt 0 ]; then
  echo "VERIFICATION FAILED"
  exit 1
else
  echo "VERIFICATION PASSED — all game pages have proper SEO meta tags"
  exit 0
fi
