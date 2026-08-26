# Install

There is nothing to install *as a package*. This repository is not published to
crates.io, npm, or any container registry, and it never will be: it is a
collection of several hundred worked example stacks, and the way you use it is
to clone it and run the one you care about, or to copy that one into your own
project.

This page gets a single form running three ways in a few minutes. For a guided
walkthrough of the same ground, see
[`docs/tutorials/01-quickstart.md`](docs/tutorials/01-quickstart.md); for
development setup and the verify gates, see
[`CONTRIBUTING.md`](CONTRIBUTING.md).

## Requirements

You only need the tools for the stacks you actually intend to run.

| Stack | Needs |
| --- | --- |
| HTML front-end | any static file server — Python 3 is enough |
| SvelteKit front-end | Node 22+ and [pnpm](https://pnpm.io/) |
| Rust back-end | Rust stable via [rustup](https://rustup.rs/), the Loco CLI (`cargo install loco`), and PostgreSQL 18 (server + client) |
| The generators and gates | Python 3.12+, plus `xmllint` for XML validation |

## Clone

```sh
git clone https://github.com/FormExamples/form-examples.git
cd form-examples
```

Every command below runs from the repository root unless it says otherwise. The
history is mirrored on [Codeberg](https://codeberg.org/formexamples/form-examples)
and [GitLab](https://gitlab.com/formexamples/form-examples) if you prefer either
host.

## Pick a form

```sh
bin/forms-as-kebab-case          # every form slug, one per line
bin/forms-as-kebab-case | wc -l  # how many there are
```

`apgar-score` is a good first target: small, complete, and quick to grasp. The
rest of this page uses it, and every other slug works the same way.

## Run the HTML front-end

Static files, no build step. It does need to be *served* rather than opened from
disk, because the JavaScript is ES modules.

```sh
cd forms/apgar-score/front-end-with-html
python3 -m http.server 8000
```

- <http://localhost:8000/index.html> — the single-page questionnaire wizard
- <http://localhost:8000/dashboard.html> — the record dashboard with sample data

The scoring engine runs entirely in the browser; no back end is involved.

## Run the SvelteKit front-end

```sh
cd forms/apgar-score/front-end-with-svelte
pnpm install
pnpm run dev
```

Open the URL Vite prints (default <http://localhost:5173/>). Routes are nested
under the form slug, so the dashboard is at `/apgar-score/apgar-scores/`.

Optional checks, all of which CI also runs:

```sh
pnpm run check        # svelte-check type gate
pnpm run build        # production build
pnpm exec vitest run  # scoring-engine unit tests
```

## Run the Rust JSON API

The back end is one Rust crate per form — axum + Loco + SeaORM, one table per
SQL entity — and it needs a reachable PostgreSQL.

### A throwaway Postgres

Skip this if you already run Postgres locally with a `loco` superuser. Note the
short socket directory: Unix socket paths are length-limited, and `mktemp -d`
under a long `TMPDIR` will exceed it.

```sh
export PGDATA="$(mktemp -d)/data"
export SOCK="$(mktemp -d)"
initdb -D "$PGDATA" -U loco --auth=trust
pg_ctl -D "$PGDATA" -o "-p 5433 -k $SOCK -c listen_addresses=''" start
createdb -h "$SOCK" -p 5433 -U loco apgar_score_development
```

### Migrate and start

```sh
cd forms/apgar-score/back-end-with-loco
export DATABASE_URL="postgres://loco@localhost/apgar_score_development?host=$SOCK&port=5433"
cargo loco db migrate
cargo loco start
```

Loco listens on `localhost:5150`, with controllers mounted under `api/`:

```sh
curl -s http://localhost:5150/api/patients
```

Useful neighbours: `cargo loco db seed` loads the sample fixtures,
`cargo loco db reset` starts over, and `forms/apgar-score/openapi/` documents
every endpoint.

### Tear down

```sh
pg_ctl -D "$PGDATA" stop
```

## Use a form in your own project

Take the form directory, not the repository. Each `forms/<slug>/` is
self-contained: the SQL schema is the source of truth, and the XML, FHIR R5,
Protocol Buffers, and OpenAPI representations are all derived from it by the
generators in `bin/`. Copy the directory, keep `sql/` as your starting schema,
and regenerate the representations if you change it.

Note the licence before you do: **CC BY-NC-SA 4.0**, which is
non-commercial and share-alike. See [`LICENSE.md`](LICENSE.md), and ask if your
use does not fit it.

## Before you deploy any of this

The scaffolded crates ship development defaults on purpose, so that everything
above is a one-command experience. They are not deployment settings.

- Replace every value in `config/development.yaml` and `config/production.yaml`
  — the committed JWT secret first — and load secrets from the environment.
- Put the API behind your own authentication and authorization. The crates
  demonstrate the data shape and the routes, not an access-control design.
- Terminate TLS in front of it, and set your own CORS policy.
- Delete the seed fixtures and personas; they are synthetic sample data.
- Re-run `cargo deny --all-features check` on your fork, on your schedule.

[`SECURITY.md`](SECURITY.md) says the same thing in more detail, and says which
of these are in scope for a vulnerability report (they are not — deploying the
development defaults unchanged is a defect in your deployment, and this is the
notice that says so).

Nothing here is clinically validated or approved for care. Treat every form as a
worked example to adapt, review, and validate yourself.
