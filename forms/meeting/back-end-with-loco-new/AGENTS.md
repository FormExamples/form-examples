# Meeting — Full-stack (Rust) — New Scaffold Agent Instructions

Alternative scaffold target for the meeting full-stack. Not the canonical
implementation — the canonical one is the sibling
[`../back-end-with-loco/`](../back-end-with-loco/).
This directory exists to host the output of a fresh
`cargo loco generate scaffold` run for diffing against the canonical
implementation.

## Tools

- `../back-end-with-loco-setup` — the shell script
  of `cargo loco generate scaffold` calls that produces a clean scaffold.
- `git diff --no-index ../back-end-with-loco .` —
  compare the new scaffold against the canonical one.
- `bin/test-form meeting` — validates the regenerated set.

## Contents

- `./index.md` — overview
- `./AGENTS.md` — this file
- `./CLAUDE.md` — Claude Code project instructions (defers to `AGENTS.md`)
- `./plan.md` — regeneration workflow
- `./tasks.md` — task tracking

## Workflow

1. Empty this directory (preserving the four documentation files).
2. Run the setup script with this directory as its target.
3. Diff against the canonical implementation.
4. Promote desired changes into the canonical directory.
5. Either discard this directory's scaffold output or commit it as a
   snapshot of the latest generator behaviour.

## Conventions

- Inherits every convention from the canonical implementation —
  Rust edition 2024, Loco 0.16, SeaORM 1.1, Tera + HTMX + Alpine.js,
  `serde(rename_all = "camelCase")` on shared structs.
- No hand edits in this directory — anything authored here should be
  promoted into the canonical sibling and regenerated.

## Verify

```sh
bin/test-form meeting
```
