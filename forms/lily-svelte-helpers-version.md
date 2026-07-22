# Lily Svelte Helpers — pinned version

This monorepo's `front-end-*-with-svelte/` subprojects conform to the
**Lily Design System Svelte helpers** contract — four single-purpose header
controls, `ThemeChooser` / `LocaleChooser` / `TextSizeChooser` / `ShareChooser`,
from `lily-design-system-svelte-helpers`. Lily Svelte helpers are consumed as
a *specification* at authoring time — there is no runtime dependency on the
upstream package. Each form's `src/lib/components/ui/{Name}Chooser.svelte` is
a vendored copy of the upstream component (read live from the pinned
checkout at apply time — see `bin/svelte-helpers-chooser-rename` and
`bin/svelte-text-size-select-refactor` / `bin/svelte-share-button-refactor`).
`LocaleChooser` additionally vendors a companion data file,
`src/lib/components/ui/locales.ts` (`defaultLocaleLabels` / `RTL_LANGUAGE_TAGS`
/ `RTL_SCRIPT_SUBTAGS`, ~436 locale entries), copied verbatim from the
upstream package. See [`AGENTS-front-end-svelte.md`](AGENTS-front-end-svelte.md)
§"Theming" for the consumption model.

This is a separate contract from [`lily-svelte-version.md`](lily-svelte-version.md)
(the generic `lily-design-system-svelte-headless` component family, snapshotted
into [`lily-svelte-spec/`](lily-svelte-spec/), including its own unrelated
`theme-select`/`theme-select-option` catalog components — those were NOT
renamed by the helpers' *-chooser rename below, and never shared more than a
class-name collision that the rename itself dissolved).

## Pinned upstream commit

| Field            | Value                                                                  |
|------------------|------------------------------------------------------------------------|
| Repository       | `lilydesignsystem/lily-design-system` (subdir `lily-design-system-svelte-helpers`) |
| Pinned commit    | `f85b1f777`                                                             |
| Helpers          | `lily-design-system-svelte-theme-chooser` 0.1.0, `-locale-chooser` 0.1.0, `-text-size-chooser` 0.1.0, `-share-chooser` 0.1.0 |
| Date pinned      | 2026-07-21                                                              |

Every package resets to 0.1.0 at this pin: a renamed package has no history
under its new name, so upstream reset the version rather than imply releases
that never existed under the new names.

## History

- **2026-07-21 — renamed `*-select`/`share-button` → `*-chooser`.** Full
  depth: package directories, exported symbols, CSS class hooks (dropping
  the `lily-` prefix `theme-select`/`locale-select` needed — the rename
  itself dissolves the class collision with the unrelated catalog
  components, so the prefix workaround is no longer needed), `data-lily-*`
  attributes, and `share-button-trigger` → `share-chooser-button` (dropping
  the old naming exception; see upstream's commit message). `themeName` /
  `localeName` / `sizeName` and DOM events are unchanged — none said
  "select". Tool: `bin/svelte-helpers-chooser-rename --check|--apply`
  (Svelte); `bin/html-helpers-chooser-rename --check|--apply` (HTML
  `text-size-select`→`text-size-chooser` / `share-button`→`share-chooser`
  only — HTML's `#theme-select`/`#locale-select` intentionally stay, since
  they mirror the untouched catalog components, not these helpers).
- **2026-07-21 — added `ShareChooser`** (as `ShareButton` at the time).
  Fourth header control; `targets` stays `[]` everywhere — this monorepo
  offers copy-link only, no social-network destinations (editorial/privacy
  decision, see the component's own docs). Tools:
  `bin/svelte-share-button-refactor` (superseded by the chooser rename
  above), `bin/html-share-button-refactor`.
- **2026-07-20 — added `TextSizeChooser`** (as `TextSizeSelect` at the
  time). Third header control; four-size catalogue
  (`small`/`medium`/`large`/`x-large`). Tools:
  `bin/svelte-text-size-select-refactor` (superseded by the chooser rename
  above), `bin/html-text-size-select-refactor`.
- **2026-07-20 — `theme-select`/`locale-select` moved from a native
  `<select>`** (with `ThemeSelectOption`/`LocaleSelectOption` children) to a
  single-glyph icon button that opens a headless `listbox`, dropping the
  prior placeholder-pinning. Tool (superseded by the chooser rename above):
  `bin/lily-svelte-theme-locale-select-refactor`.

## How to refresh

1. Update your local Lily checkout:
   `git -C ~/git/lilydesignsystem/lily-design-system fetch && git -C ~/git/lilydesignsystem/lily-design-system checkout <new-hash>`
2. Run `bin/svelte-helpers-chooser-rename --check` (or whichever rollout
   tool applies to the upstream change) to see the diff against the current
   fleet; the Svelte-side scripts read the component source directly from
   the pinned checkout at apply time, so there is no template to hand-edit
   for a pure content change — only for a *shape* change (new props, new
   class hooks) would `bin/*-refactor`'s own regex/markup need updating.
3. Bump the *Pinned commit* / *Helpers* / *Date pinned* rows above and add
   a *History* entry.
4. Run the relevant `--apply` plus the one bespoke form
   (`medical-language-speaking-assessment-for-cymraeg`) by hand, since it
   drives `LocaleChooser`/`ShareChooser` through its own i18n store and is
   skipped by the automated scripts for anything beyond a pure rename.
5. Spot-check a few `front-end-with-svelte/` subprojects with
   `pnpm install && pnpm check && pnpm test`, and the HTML equivalents in a
   browser (native `<select>`/vanilla JS has no build step to catch drift).
6. Commit with a message referencing the new upstream hash.
