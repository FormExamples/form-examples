# Lily Svelte Headless — pinned version

This monorepo's `front-end-*-with-svelte/` subprojects conform to the
**Lily Design System Svelte headless** component contract.

**As of 2026-09-16, `@lilydesignsystem/svelte-headless` is a real pnpm
dependency in every form**, not a specification consumed only at authoring
time. (Published under the unscoped name `lily-design-system-svelte-headless`
for one day, then moved to the `@lilydesignsystem` npm scope the same day —
see the History note below; `bin/svelte-lily-scope-rename` did the rename
fleet-wide.) `bin/svelte-lily-pnpm-migrate` compared each form's
hand-authored `src/lib/components/ui/<Name>.svelte` against the published
package (comment/quote-style-insensitive) and, for every one that was a
faithful mirror, deleted the local file and rewrote its importers to
`import { Name } from "@lilydesignsystem/svelte-headless"`. A component
whose local copy had genuinely diverged — for a real reason, not just
formatting — is left vendored and untouched:

- `Form.svelte` — adds `novalidate` (native constraint validation must not
  block the wizard's own `validate()` + `ErrorSummary` submit path).
- `NumberInput.svelte` — defaults `value` to `null`, not `undefined`, per
  this repo's "`null` for unanswered numeric fields" convention.
- `Field.svelte` / `Fieldset.svelte` — add extra CSS class hooks
  (`class="label"` / `"hint"` / `"error-message"` / `"fieldset-legend"`)
  the plain headless markup doesn't have, for the Tailwind token styling
  layer.
- `Alert.svelte`, `Select.svelte`, `StepList.svelte`, `StepListItem.svelte`,
  `Badge.svelte` (where present) — smaller, mostly cosmetic divergences
  from the current published version (e.g. a `const`/`let` difference on
  a `$derived`, a TS-only generic annotation) that the tool's diff still
  correctly treats as "don't touch" rather than force a swap.

Typically ~15-21 of the ~26 headless components a given form's `ui/`
directory names actually get migrated per form; the rest stay vendored for
the reasons above. This is a fleet-wide fact discovered by the migration,
not a per-form decision — re-run `bin/svelte-lily-pnpm-migrate --dry-run
--all` to see the current split. See
[`AGENTS-front-end-svelte.md`](AGENTS-front-end-svelte.md) §2 for the
updated consumption model, and
[`lily-svelte-helpers-version.md`](lily-svelte-helpers-version.md) for the
picker family's own (larger) pnpm migration.

## Pinned upstream commit

| Field            | Value                                                                  |
|------------------|------------------------------------------------------------------------|
| Repository       | `lilydesignsystem/lily-design-system` (subdir `lily-design-system-svelte-headless` — the git subdirectory name is unchanged by the npm scope move) |
| Pinned commit    | `a89961e8f`                                                             |
| npm package depended on | `@lilydesignsystem/svelte-headless` `^0.1.0` |
| Date pinned      | 2026-08-31                                                              |
| Snapshot         | [`lily-svelte-spec/`](lily-svelte-spec/) — one subdirectory per component |

This pin is the contract our forms build against, and remains the
reference the sync/rename tools read from. The npm dependency version
forms actually consume is pinned separately, by ordinary semver range in
each form's `package.json`. Newer Lily Svelte commits may introduce
breaking API changes; verify with `bin/lily-svelte-sync --check` and the
per-form Svelte tests before bumping either pin.

## How to refresh

1. Update your local Lily checkout:
   `git -C ~/git/lilydesignsystem/lily-design-system fetch && git -C ~/git/lilydesignsystem/lily-design-system checkout <new-hash>`
2. Run `bin/lily-svelte-sync` to copy the new component sources into
   `forms/lily-svelte-spec/` and update the *Pinned commit* / *Date pinned*
   rows of this file.
3. Spot-check a few `front-end-form-with-svelte/` subprojects with
   `pnpm install && pnpm check && pnpm test`.
4. Commit with a message referencing the new upstream hash.
