# Plan: Loco scaffold generator

## Status

Scaffolded 2026-05-18 by `bin/create-form`. The `00-new.sh` script is
auto-generated; this directory only needs documentation files.

## Build order

1. [ ] Verify `00-new.sh` matches the canonical pattern in the parent
       `AGENTS/back-end-with-loco-setup.md`.
2. [ ] Confirm Postgres role and database names match the form slug in
       `snake_case`.
3. [ ] Run `./00-new.sh` to scaffold the sibling Loco crate.

After scaffolding, all further implementation work happens in
`../back-end-with-loco/`.
