# Plan: Meeting — Full-stack (Rust) — New Scaffold

## Current status

Scaffolded 2026-05-13. This is the regeneration target — no
implementation lives here yet.

## Goal

Host the output of a clean
`cargo loco generate scaffold` run for the meeting form so the result
can be diffed against the canonical implementation in
[`../full-stack-with-loco-tera-htmx-alpine/`](../full-stack-with-loco-tera-htmx-alpine/).

## Regeneration workflow

1. Keep `index.md`, `AGENTS.md`, `CLAUDE.md`, `plan.md`, `tasks.md`
   intact; remove every other file from this directory.
2. Run `../full-stack-with-loco-tera-htmx-alpine-setup` with this
   directory as the target.
3. `git diff --no-index ../full-stack-with-loco-tera-htmx-alpine .`
4. For each meaningful difference, decide whether to:
   - promote the new behaviour into the canonical directory,
   - update the setup script,
   - or revert and keep the canonical behaviour.
5. Re-run `bin/test-form meeting` against the canonical directory.

## Design principles

- This directory is disposable. The canonical sibling is the source of
  truth.
- No hand edits — every change should be reproducible by re-running the
  setup script.
- Commit the regenerated tree only when it represents a new generator
  baseline worth comparing against in the future.
