# Lily Svelte Helpers — pinned version

This monorepo's `front-end-*-with-svelte/` subprojects conform to the
**Lily Design System Svelte helpers** contract — four single-purpose header
controls, `ThemePicker` / `LocalePicker` / `TextSizePicker` / `SharePicker`,
from `lily-design-system-svelte-helpers`. Lily Svelte helpers are consumed as
a _specification_ at authoring time — there is no runtime dependency on the
upstream package. Each form's `src/lib/components/ui/{Name}Picker.svelte` is
a vendored copy of the upstream component (read live from the pinned
checkout at apply time — see `bin/svelte-helpers-picker-rename` and,
historically, `bin/svelte-helpers-chooser-rename` /
`bin/svelte-text-size-select-refactor` / `bin/svelte-share-button-refactor`).
`LocalePicker` additionally vendors a companion data file,
`src/lib/components/ui/locales.ts` (`defaultLocaleLabels` / `RTL_LANGUAGE_TAGS`
/ `RTL_SCRIPT_SUBTAGS`, ~436 locale entries), copied verbatim from the
upstream package. See [`AGENTS-front-end-svelte.md`](AGENTS-front-end-svelte.md)
§"Theming" for the consumption model.

This is a separate contract from [`lily-svelte-version.md`](lily-svelte-version.md)
(the generic `lily-design-system-svelte-headless` component family, snapshotted
into [`lily-svelte-spec/`](lily-svelte-spec/), including its own unrelated
`theme-select`/`theme-select-option` catalog components — those were NOT
renamed by the helpers' renames below, and never shared more than a
class-name collision that the first rename dissolved).

## Pinned upstream commit

| Field         | Value                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Repository    | `lilydesignsystem/lily-design-system` (subdir `lily-design-system-svelte-helpers`)                                        |
| Pinned commit | `217902415`                                                                                                               |
| Helpers       | `lily-design-system-svelte-theme-picker` 0.1.0, `-locale-picker` 0.1.0, `-text-size-picker` 0.1.0, `-share-picker` 0.1.0 |
| Date pinned   | 2026-07-28                                                                                                                |

Upstream also added a fifth helper at this pin, `date-time-picker` (all
seven catalogs), and fixed doc/example gaps in `text-size-picker` — neither
is consumed by this monorepo yet; this bump is for the reference `themes/`
stylesheets only (below). Rolling out `date-time-picker` to any form is a
separate, unstarted decision, not implied by this pin bump.

Every package resets to 0.1.0 at this pin: a renamed package has no history
under its new name, so upstream reset the version rather than imply releases
that never existed under the new names.

## History

- **2026-07-28 — re-synced the vendored reference `themes/*.css`.** The 45
  reference theme stylesheets in every form's `front-end-with-html/css/themes/`
  and `front-end-with-svelte/static/themes/` were stale relative to the pin
  (missing icon-scale corrections and other upstream fixes) because the tool
  that first vendored them, `bin/html-theme-locale-select-refactor`, only
  re-copied the theme catalogue when it *also* had a header-control patch to
  apply — once a form was fully patched, the theme catalogue could never be
  refreshed again. Fixed by decoupling the theme-CSS copy from that
  condition (its own size-compare skip already made it idempotent) and by
  adding `bin/svelte-theme-css-sync`, since the Svelte side never had a
  re-sync tool at all — its `static/themes/` was a one-shot copy from the
  now-superseded `bin/lily-svelte-theme-locale-select-refactor` with no
  ongoing drift detector. Tools: `bin/html-theme-locale-select-refactor
  --check|--apply` (HTML, now re-syncs on every run); `bin/svelte-theme-css-sync
  --check|--apply` (Svelte, new).
- **2026-07-27 — renamed `*-chooser` → `*-picker` ("to harmonize with
  Adobe").** Full depth: package directories, exported symbols, CSS class
  hooks, `data-lily-*` attributes, and `share-chooser-button` →
  `share-picker-button`. `themeName`/`localeName`/`sizeName` and DOM events
  are unchanged. Tool: `bin/svelte-helpers-picker-rename --check|--apply`
  (Svelte); `bin/html-helpers-picker-rename --check|--apply` (HTML
  `text-size-chooser`→`text-size-picker` / `share-chooser`→`share-picker`
  only — HTML's `#theme-select`/`#locale-select` intentionally stay
  untouched, as below).
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
  `text-size-select`→`text-size-picker` / `share-button`→`share-chooser`
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
2. Run `bin/svelte-helpers-picker-rename --check` (or whichever rollout
   tool applies to the upstream change) to see the diff against the current
   fleet; the Svelte-side scripts read the component source directly from
   the pinned checkout at apply time, so there is no template to hand-edit
   for a pure content change — only for a _shape_ change (new props, new
   class hooks) would `bin/*-refactor`'s own regex/markup need updating.
3. Bump the _Pinned commit_ / _Helpers_ / _Date pinned_ rows above and add
   a _History_ entry.
4. Run the relevant `--apply` plus the one bespoke form
   (`medical-language-speaking-assessment-for-cymraeg`) by hand, since it
   drives `LocalePicker`/`SharePicker` through its own i18n store and is
   skipped by the automated scripts for anything beyond a pure rename.
5. Spot-check a few `front-end-with-svelte/` subprojects with
   `pnpm install && pnpm check && pnpm test`, and the HTML equivalents in a
   browser (native `<select>`/vanilla JS has no build step to catch drift).
6. Commit with a message referencing the new upstream hash.
