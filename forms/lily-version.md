# Lily Design System — pinned version

The medical forms in this repo conform to the **Lily Design System HTML
headless** class contract. Lily is consumed as a *specification* at
authoring time — there is no runtime dependency, bundle, or vendored
file. See [`AGENTS-front-end-html.md`](AGENTS-front-end-html.md) §2 for
the consumption model.

## Pinned upstream commit

| Field            | Value                                                                  |
|------------------|------------------------------------------------------------------------|
| Repository       | `lilydesignsystem/lily-design-system` (subdir `lily-design-system-html-headless`) |
| Pinned commit    | `7a51013`                                                              |
| Date pinned      | 2026-05-24                                                             |
| Verified by      | Phase 0.4 component coverage check (every required component present). |

This pin is the contract we built against. Newer Lily commits may
introduce breaking changes to class names; verify with
`bin/lily-html-refactor --check --all` before bumping the pin.

## How to refresh

There is no automated `bin/lily-sync` yet (Phase 0.2 is still open).
Manual refresh:

1. Update your local Lily checkout:
   `git -C ~/git/lilydesignsystem/lily-design-system fetch && git -C ~/git/lilydesignsystem/lily-design-system checkout <new-hash>`
2. Run `bin/lily-html-refactor --check --all` — confirm no new
   safe swaps would be applied (a non-zero exit means the new Lily
   commit changed a class name we currently consume).
3. Spot-check a handful of forms in a browser via `file://`.
4. Update the *Pinned commit* and *Date pinned* rows in this file.
5. Commit with a message referencing the new upstream hash.
