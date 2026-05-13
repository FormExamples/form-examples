#!/usr/bin/env bash
#
# Agile Consulting Scorecard — end-to-end pipeline demo.
#
# Boots the Loco backend on a free local port (using a temporary
# Postgres database), exercises every one of the nine HTTP endpoints
# with the golden sample, prints the highlights, and tears the
# backend down. Useful as a smoke test and as a copy-paste-able
# walkthrough of the wire API.
#
# Usage:
#   scripts/demo.sh
#
# Requirements: cargo, curl, python3, and a running PostgreSQL
# accessible at $LOCO_DATABASE_URL (or the default
# postgres://postgres:postgres@localhost:5432/postgres). The script
# creates a fresh demo database, lets Loco run migrations, exercises
# the endpoints, then drops the database.

set -euo pipefail

FORM_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
CRATE_DIR="$FORM_DIR/full-stack-with-loco-tera-htmx-alpine"
SAMPLE="$FORM_DIR/samples/sample-assessment.json"

if [[ ! -f "$SAMPLE" ]]; then
  echo "fatal: $SAMPLE not found" >&2
  exit 1
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASS="${DB_PASS:-postgres}"
DB_NAME="${DB_NAME:-agile_consulting_scorecard_demo_$$}"

if ! command -v psql >/dev/null 2>&1; then
  echo "fatal: psql not on PATH — install PostgreSQL client tools" >&2
  exit 1
fi

# Probe Postgres availability before doing anything expensive.
if ! PGPASSWORD="$DB_PASS" psql \
      -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
      -c "select 1" >/dev/null 2>&1; then
  cat <<EOF >&2
fatal: cannot reach PostgreSQL at $DB_HOST:$DB_PORT as $DB_USER.

The Loco backend needs a Postgres instance. Either:

  1. Start one (e.g. via Docker):
       docker run -d --name pg -p 5432:5432 \\
         -e POSTGRES_PASSWORD=postgres postgres:18

  2. Or point this script at an existing instance via the
     DB_HOST / DB_PORT / DB_USER / DB_PASS env vars.

Without Postgres you can still run the DB-free pieces:

  - The engine unit tests:        (cd $CRATE_DIR && cargo test --lib)
  - The SvelteKit dashboard:      (cd $FORM_DIR/front-end-dashboard-with-svelte && pnpm run dev)
  - The static HTML triple:       open $FORM_DIR/front-end-form-with-html/index.html
EOF
  exit 1
fi

PORT=${PORT:-15500}
while nc -z 127.0.0.1 "$PORT" 2>/dev/null; do
  PORT=$((PORT + 1))
done
BASE="http://127.0.0.1:$PORT"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  PGPASSWORD="$DB_PASS" psql \
    -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
    -c "drop database if exists \"$DB_NAME\"" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "==> creating demo database $DB_NAME on $DB_HOST:$DB_PORT"
PGPASSWORD="$DB_PASS" psql \
  -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
  -c "create database \"$DB_NAME\"" >/dev/null

export LOCO_SERVER__PORT="$PORT"
export LOCO_DATABASE__URI="postgres://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"

echo "==> building + launching Loco backend on $BASE"
(
  cd "$CRATE_DIR"
  cargo run --quiet --bin agile-consulting-scorecard-cli -- start &
  echo $! > /tmp/agile-scorecard-demo.pid
) &
sleep 1
# Wait up to 60s for the server to boot (migrations + start).
for _ in $(seq 1 120); do
  if curl -s -o /dev/null -w '%{http_code}' "$BASE/" 2>/dev/null | grep -q '^2..$'; then
    break
  fi
  sleep 0.5
done
SERVER_PID=$(cat /tmp/agile-scorecard-demo.pid 2>/dev/null || true)
if [[ -z "$SERVER_PID" ]] || ! curl -s -o /dev/null "$BASE/"; then
  echo "fatal: Loco backend failed to start on $BASE" >&2
  exit 1
fi

echo
echo "==> root help banner"
curl -s "$BASE/" | head -2

echo
echo "==> /api/dashboard/scorecards — fresh DB starts empty"
curl -s "$BASE/api/dashboard/scorecards" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('total:', d['total'])
"

echo
echo "==> POST /api/scorecards — submit golden sample"
SUBMIT_RES=$(curl -s -X POST -H 'Content-Type: application/json' --data @"$SAMPLE" "$BASE/api/scorecards")
echo "$SUBMIT_RES" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('id:', d['id'], 'band:', d['computedBand'], 'score:', d['scoreTotal'])
"

echo
echo "==> POST /api/grade — stateless grading"
curl -s -X POST -H 'Content-Type: application/json' --data @"$SAMPLE" \
  "$BASE/api/grade" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('score {0}/16   band {1}'.format(d['scoreTotal'], d['computedBand']))
print('flags:', [f['category'] for f in d['additionalFlags']])
"

echo
echo "==> POST /api/recommendations"
curl -s -X POST -H 'Content-Type: application/json' --data @"$SAMPLE" \
  "$BASE/api/recommendations" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('total', d['total'])
for a in d['items']:
    print('  {0:<4}  {1}'.format(a['itemKey'], a['heading']))
"

echo
echo "==> POST /api/pre-tender"
curl -s -X POST -H 'Content-Type: application/json' --data @"$SAMPLE" \
  "$BASE/api/pre-tender" | python3 -c "
import sys, json
d = json.load(sys.stdin)
o = d['organization']
s = d['score']
print('organization {0}  ({1} / {2})'.format(o['organizationName'], o['sector'], o['sizeBand']))
print('score {0}/16   band {1}   recommendation {2}'.format(s['total'], s['band'], s['recommendation']))
"

echo
echo "==> POST /api/bulk-import — three more golden rows"
GOLDEN_ONELINE=$(python3 -c "import json,sys; print(json.dumps(json.load(open(sys.argv[1])), separators=(',',':')))" "$SAMPLE")
printf "# bulk-import demo\n\n%s\n%s\nnot-json\n%s\n" "$GOLDEN_ONELINE" "$GOLDEN_ONELINE" "$GOLDEN_ONELINE" \
  | curl -s -X POST -H 'Content-Type: application/x-ndjson' --data-binary @- "$BASE/api/bulk-import" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('accepted {0}  rejected {1}  totalLines {2}'.format(d['accepted'], len(d['rejected']), d['totalLines']))
"

echo
echo "==> /api/stats after submissions"
curl -s "$BASE/api/stats" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('total {0}  avg {1:.2f}  flags {2}'.format(d['total'], d['averageScore'], d['flagCount']))
b = d['byBand']
print('bands:  low {0}   borderline {1}   medium {2}   high {3}'.format(b['low'], b['borderline'], b['medium'], b['high']))
"

echo
echo "==> done — tearing down Loco backend + dropping demo database"
