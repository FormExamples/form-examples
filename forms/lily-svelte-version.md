# Lily Svelte Headless — pinned version

This monorepo's `front-end-*-with-svelte/` subprojects conform to the
**Lily Design System Svelte headless** component contract. Lily Svelte is
consumed as a *specification* at authoring time — there is no runtime
dependency on the upstream package. See
[`AGENTS-front-end-svelte.md`](AGENTS-front-end-svelte.md) §2 for the
consumption model.

## Pinned upstream commit

| Field            | Value                                                                  |
|------------------|------------------------------------------------------------------------|
| Repository       | `lilydesignsystem/lily-design-system` (subdir `lily-design-system-svelte-headless`) |
| Pinned commit    | `7b5e39c39`                                                             |
| Date pinned      | 2026-07-02                                                              |
| Snapshot         | [`lily-svelte-spec/`](lily-svelte-spec/) — one subdirectory per component |

This pin is the contract our forms build against. Newer Lily Svelte commits
may introduce breaking API changes; verify with `bin/lily-svelte-sync --check`
and the per-form Svelte tests before bumping the pin.

## How to refresh

1. Update your local Lily checkout:
   `git -C ~/git/lilydesignsystem/lily-design-system fetch && git -C ~/git/lilydesignsystem/lily-design-system checkout <new-hash>`
2. Run `bin/lily-svelte-sync` to copy the new component sources into
   `forms/lily-svelte-spec/` and update the *Pinned commit* / *Date pinned*
   rows of this file.
3. Spot-check a few `front-end-form-with-svelte/` subprojects with
   `pnpm install && pnpm check && pnpm test`.
4. Commit with a message referencing the new upstream hash.
