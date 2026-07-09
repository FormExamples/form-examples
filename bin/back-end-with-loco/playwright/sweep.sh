#!/usr/bin/env bash
# Run the JSON API contract test against every back-end-with-loco crate
# that follows the canonical route layout (has
# src/<form_snake_case>/models/_entities/assessments.rs, .../app.rs,
# .../bin/main.rs, and migration/Cargo.toml).
#
# Prerequisites:
#  - Postgres at localhost:5432 with user=postgres password=postgres
#  - Playwright + Node installed under the playwright-skill plugin
#
# Results are written to /tmp/sweep-results.tsv as "<slug>\t<status>".
# Status is one of PASS, FAIL, BUILD_FAIL, SERVER_DOWN, NO_BIN.

set -uo pipefail

REPO=$(git rev-parse --show-toplevel)
SKILL=${SKILL:-/Users/jph/.claude/plugins/cache/playwright-skill/playwright-skill/4.0.2/skills/playwright-skill}
SPEC=$REPO/bin/back-end-with-loco/playwright/api-contract.spec.js
OUT=${OUT:-/tmp/sweep-results.tsv}

> "$OUT"

mapfile -t FORMS < <(cd "$REPO" && python3 -c "
from pathlib import Path
for d in sorted(Path('forms').iterdir()):
    if not d.is_dir() or d.name.startswith('.'): continue
    crate = d / 'back-end-with-loco'
    if not crate.is_dir(): continue
    src = crate / 'src' / d.name.replace('-', '_')   # route layout: src/<form_snake_case>/
    if not (src / 'models/_entities/assessments.rs').is_file(): continue
    if not (src / 'app.rs').is_file(): continue
    if not (src / 'bin/main.rs').is_file(): continue
    if not (crate / 'migration/Cargo.toml').is_file(): continue
    print(d.name)
")

slug_to_snake() { echo "$1" | tr '-' '_'; }
slug_to_crate_bin() {
  awk '/^name = .*-cli"/{gsub(/"/,""); print $3}' "$REPO/forms/$1/back-end-with-loco/Cargo.toml" | head -1
}

i=0
for slug in "${FORMS[@]}"; do
  i=$((i+1))
  crate_dir="$REPO/forms/$slug/back-end-with-loco"
  db=$(slug_to_snake "$slug")_development
  PGPASSWORD=postgres createdb -h localhost -U postgres "$db" 2>/dev/null || true

  bin=$(slug_to_crate_bin "$slug")
  if [ -z "$bin" ]; then
    printf "%s\tNO_BIN\n" "$slug" >> "$OUT"
    echo "[$i/${#FORMS[@]}] $slug: NO_BIN"; continue
  fi

  port=$(grep -E '^  port:' "$crate_dir/config/development.yaml" | awk '{print $2}' | head -1)
  [ -z "$port" ] && port=5150

  pushd "$crate_dir" > /dev/null
  if ! cargo build --quiet --bin "$bin" 2>/tmp/build-$slug.err; then
    printf "%s\tBUILD_FAIL\n" "$slug" >> "$OUT"
    echo "[$i/${#FORMS[@]}] $slug: BUILD_FAIL"
    popd > /dev/null
    continue
  fi
  ./target/debug/"$bin" db migrate > /tmp/migrate-$slug.log 2>&1 || true
  nohup ./target/debug/"$bin" start > /tmp/loco-$slug.log 2>&1 &
  pid=$!
  popd > /dev/null

  ready=""
  for _ in {1..20}; do
    if curl -fsS "http://localhost:$port/_ping" > /dev/null 2>&1; then ready=1; break; fi
    sleep 0.5
  done

  if [ -z "$ready" ]; then
    printf "%s\tSERVER_DOWN\n" "$slug" >> "$OUT"
    echo "[$i/${#FORMS[@]}] $slug: SERVER_DOWN"
    kill $pid 2>/dev/null
    sleep 0.5
    continue
  fi

  out=$(cd "$SKILL" && TARGET_URL="http://localhost:$port" node run.js "$SPEC" 2>&1)
  if echo "$out" | grep -q "ALL CHECKS PASSED"; then
    printf "%s\tPASS\n" "$slug" >> "$OUT"
    echo "[$i/${#FORMS[@]}] $slug: PASS"
  else
    printf "%s\tFAIL\n" "$slug" >> "$OUT"
    echo "[$i/${#FORMS[@]}] $slug: FAIL"
    echo "$out" | tail -5 > /tmp/fail-$slug.log
  fi

  kill $pid 2>/dev/null
  sleep 0.5
done

echo
echo "=== Summary ==="
echo "PASS: $(awk -F'\t' '$2=="PASS"' "$OUT" | wc -l)"
echo "FAIL: $(awk -F'\t' '$2=="FAIL"' "$OUT" | wc -l)"
echo "SERVER_DOWN: $(awk -F'\t' '$2=="SERVER_DOWN"' "$OUT" | wc -l)"
echo "BUILD_FAIL: $(awk -F'\t' '$2=="BUILD_FAIL"' "$OUT" | wc -l)"
echo "NO_BIN: $(awk -F'\t' '$2=="NO_BIN"' "$OUT" | wc -l)"
