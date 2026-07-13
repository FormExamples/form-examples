# Tutorial 1 — Quickstart: run one form locally

This walkthrough runs a single form, **`apgar-score`**, three ways: its static
HTML front-end, its SvelteKit front-end, and its Rust + Loco JSON API. By the
end you will have the questionnaire open in a browser and the API answering
`curl`.

Everything below uses real paths in this repo — `apgar-score` is a small,
fully-built form (a five-sign newborn score), so it is a good first target.

## Prerequisites

- **Git** and a POSIX shell.
- **Python 3** (for the static server) — already required by the toolchain.
- **Node + [pnpm](https://pnpm.io/)** for the Svelte front-end.
- **Rust** (stable, via [rustup](https://rustup.rs/)) and the Loco CLI for the
  back-end: `cargo install loco`.
- **PostgreSQL** client + server binaries (`initdb`, `pg_ctl`, `createdb`) for
  the back-end database.

## 0. Clone and enter the repo

```sh
git clone https://github.com/joelparkerhenderson/form-examples.git
cd form-examples
```

If you already have the repo, just `cd` into it. All commands in every tutorial
are written to run from the **repository root** unless stated otherwise.

## 1. The HTML front-end (static files)

The consolidated HTML front-end is plain static files — `index.html` (the
wizard), `dashboard.html` (the record list), plus `css/` and `js/`. It needs no
build step; any static file server works.

```sh
cd forms/apgar-score/front-end-with-html
python3 -m http.server 8000
```

Now open:

- <http://localhost:8000/index.html> — the single-page questionnaire wizard.
- <http://localhost:8000/dashboard.html> — the sample-record dashboard.

Fill in the five signs at 1 and 5 minutes, submit, and read the generated
clinical report with its flagged issues. Stop the server with `Ctrl-C`.

## 2. The Svelte front-end (SvelteKit dev server)

The SvelteKit app holds the same wizard plus a pure TypeScript scoring engine
(`src/lib/engine/`) and RESTful routes nested under `src/routes/apgar-score/`,
so it is served at the `/apgar-score/` path.

```sh
cd forms/apgar-score/front-end-with-svelte
pnpm install
pnpm run dev
```

Open the URL Vite prints (default <http://localhost:5173/>) and navigate to
**`/apgar-score/apgar-scores/`** for the dashboard, or
**`/apgar-score/apgar-scores/new`**-style record routes for the wizard. The
engine grades entirely in the browser.

Optional health checks for the Svelte app:

```sh
pnpm run check          # svelte-check type gate
pnpm run build          # production build
pnpm exec vitest run    # engine unit tests
```

## 3. The Loco JSON API (Rust back-end)

The back-end is a Rust axum + Loco crate — one crate per form, one table per SQL
entity. It reads `DATABASE_URL` (default
`postgres://loco:loco@localhost:5432/apgar_score_test`) and needs a reachable
Postgres.

### 3a. A throwaway Postgres

If you already run Postgres on `localhost:5432` with a `loco` superuser, skip to
3b and use the default `DATABASE_URL`. Otherwise spin up a disposable instance
(the same recipe as `CONTRIBUTING.md`, using a **short** socket directory
because Unix socket paths are length-limited):

```sh
export PGDATA="$(mktemp -d)/data"
export SOCK="$(mktemp -d)"
initdb -D "$PGDATA" -U loco --auth=trust
pg_ctl -D "$PGDATA" -o "-p 5433 -k $SOCK -c listen_addresses=''" start
createdb -h "$SOCK" -p 5433 -U loco apgar_score_development
```

### 3b. Migrate and start

```sh
cd forms/apgar-score/back-end-with-loco
export DATABASE_URL="postgres://loco@localhost/apgar_score_development?host=$SOCK&port=5433"
cargo loco db migrate
cargo loco start
```

Loco listens on `localhost:5150`. Controllers mount under the `api/` prefix, so
in another shell:

```sh
curl -s http://localhost:5150/api/patients
```

You should get a JSON array (empty until you create a record). Tutorial 5
(`05-consume-the-api.md`) drives full CRUD against these endpoints and maps them
to the OpenAPI specs.

### 3c. Tear down the throwaway Postgres

```sh
pg_ctl -D "$PGDATA" stop
```

## Verify you got here

```sh
# The three front-end/back-end roots this tutorial used all exist:
ls forms/apgar-score/front-end-with-html/index.html
ls forms/apgar-score/front-end-with-html/dashboard.html
ls forms/apgar-score/front-end-with-svelte/package.json
ls forms/apgar-score/back-end-with-loco/Cargo.toml
# Structural test for the whole form:
bin/test-form apgar-score
```
