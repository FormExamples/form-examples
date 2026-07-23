# Lily HTML Headless — pinned version

This monorepo's `front-end-*-with-html/` subprojects conform to the
**Lily Design System HTML headless** class contract. Lily HTML is consumed
as a *specification* at authoring time — there is no runtime dependency on
the upstream package. See
[`AGENTS-front-end-html.md`](AGENTS-front-end-html.md) for the consumption
model.

## Pinned upstream commit

| Field            | Value                                                                  |
|------------------|------------------------------------------------------------------------|
| Repository       | `lilydesignsystem/lily-design-system` (subdir `lily-design-system-html-headless`) |
| Pinned commit    | `9168437b9`                                                              |
| Date pinned      | 2026-07-23                                                             |
| Snapshot         | [`lily-spec/`](lily-spec/) — one file per component spec               |

This pin is the contract our forms build against. Newer Lily HTML commits
may introduce breaking class changes; verify with `bin/lily-sync --check`
and `bin/lily-html-refactor --check --all` before bumping the pin.

## How to refresh

1. Update your local Lily checkout:
   `git -C ~/git/lilydesignsystem/lily-design-system fetch && git -C ~/git/lilydesignsystem/lily-design-system checkout <new-hash>`
2. Run `bin/lily-sync` to copy the new component specs into
   `forms/lily-spec/` and update the *Pinned commit* / *Date pinned*
   rows of this file.
3. Run `bin/lily-html-refactor --check --all` to confirm no contract drift.
4. Commit with a message referencing the new upstream hash.
