# Return to Work — Loco scaffold generator

Shell script that scaffolds the sibling
`full-stack-with-loco-tera-htmx-alpine/` Rust project from scratch
via the Loco CLI. Re-runnable on a clean machine.

## Files

- `00-new.sh` — shell entry point that creates the PostgreSQL roles
  and databases, then runs `loco new` to scaffold the project.

## Pre-requisites

- `cargo` ≥ 1.84.
- `loco` CLI installed (`cargo install loco-cli`).
- Local PostgreSQL with `postgres` superuser available via `psql`.

## Running

```sh
./00-new.sh
```
