# Lily Svelte Helpers — pinned version

This monorepo's `front-end-*-with-svelte/` subprojects conform to the
**Lily Design System Svelte helpers** contract — four single-purpose header
controls, `ThemePicker` / `LocalePicker` / `TextSizePicker` / `SharePicker`,
plus a fifth, `DateTimePicker`.

**As of 2026-09, `ThemePicker`/`LocalePicker`/`TextSizePicker`/`SharePicker`
are real pnpm dependencies, not vendored copies.** `bin/svelte-lily-pnpm-migrate`
replaced every form's `src/lib/components/ui/{Name}Picker.svelte` (and the
companion `locales.ts` data file) with a `package.json` dependency on the
published `@lilydesignsystem/svelte-theme-picker` / `-locale-picker` /
`-text-size-picker` / `-share-picker` packages (published unscoped for one
day, then moved to the `@lilydesignsystem` npm scope the same day — see
History), and — in every form whose header wiring matched the fleet's
standard four-picker block (355/356) — consolidated the four separate
components behind a fifth package, `@lilydesignsystem/svelte-picker-bar`,
imported as `PickerBar` in each form's root `+layout.svelte`. The one exception,
`medical-language-speaking-assessment-for-cymraeg`, drives the pickers
through its own i18n store and keeps four separate `<ThemePicker>`/etc.
tags — now importing from the real packages, just not consolidated.
`PickerBar`'s `shareTargets` prop is populated from a new small vendored
file per form, `src/lib/config/share-targets.ts`, defining the fleet's six
share destinations: copy link (via `SharePicker`'s built-in `copyLabel`),
email, LinkedIn, Reddit, Bluesky, and Mastodon (via mastodonshare.com).

`DateTimePicker` remains vendored into every form but **not currently used
by any form** (see below) — it is vendored by
`bin/svelte-date-time-picker-vendor`, which still reads live from the
pinned checkout at apply time. See
[`AGENTS-front-end-svelte.md`](AGENTS-front-end-svelte.md) §"Theming" for
the consumption model.

This is a separate contract from [`lily-svelte-version.md`](lily-svelte-version.md)
(the generic `@lilydesignsystem/svelte-headless` component family, snapshotted
into [`lily-svelte-spec/`](lily-svelte-spec/), including its own unrelated
`theme-select`/`theme-select-option` catalog components — those were NOT
renamed by the helpers' renames below, and never shared more than a
class-name collision that the first rename dissolved).

## Pinned versions

`ThemePicker`/`LocalePicker`/`TextSizePicker`/`SharePicker`/`PickerBar` are
now pinned by `package.json` semver range, like any other npm dependency —
there is no checkout commit to record for them any more. `DateTimePicker`
stays vendor-only and is still pinned by upstream commit.

| Field                                              | Value    |
| --------------------------------------------------- | -------- |
| `@lilydesignsystem/svelte-theme-picker`             | `^0.1.0` |
| `@lilydesignsystem/svelte-locale-picker`            | `^0.1.0` |
| `@lilydesignsystem/svelte-text-size-picker`         | `^0.1.0` |
| `@lilydesignsystem/svelte-share-picker`             | `^0.1.0` |
| `@lilydesignsystem/svelte-picker-bar`               | `^0.1.0` |
| Date migrated to pnpm dependencies                  | 2026-09-16 |
| Date moved to the `@lilydesignsystem` npm scope     | 2026-09-17 |

| Field         | Value                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Repository    | `lilydesignsystem/lily-design-system` (subdir `lily-design-system-svelte-helpers`)                                        |
| Pinned commit (DateTimePicker only) | `63e059f3`                                                                                          |
| Date pinned   | 2026-08-13                                                                                                                |

`text-size-picker` also got doc/example gap fixes upstream at this pin —
dev-facing only, nothing to sync into a form.

**`DateTimePicker` is vendor-only.** Its own spec explicitly says a
hand-rolled calendar dialog has weaker assistive-technology support than
`<input type="date">`, "which is the right default for many services" —
and every form already uses exactly that native input via the existing
`DateInput.svelte` (see `forms/AGENTS-front-end-svelte.md`). Swapping any
form's date fields for the new dialog is a real accessibility tradeoff,
not a pure upgrade, so it is a separate, unstarted decision per form —
`DateTimePicker.svelte` sits vendored and unused until that decision is
made. Do not wire it into a `+layout.svelte`/route/step "to demonstrate it
works."

Every package resets to 0.1.0 at this pin: a renamed package has no history
under its new name, so upstream reset the version rather than imply releases
that never existed under the new names.

## History

- **2026-09-17 — moved to the `@lilydesignsystem` npm scope.** Upstream
  republished all six packages under `@lilydesignsystem/svelte-{headless,
  theme-picker,locale-picker,text-size-picker,share-picker,picker-bar}`,
  resetting every version to `0.1.0` (the unscoped names had no history to
  imply carrying forward, same rationale as the earlier `*-chooser` →
  `*-picker` rename). Confirmed content-identical before renaming (e.g.
  `svelte-headless`'s `Button.svelte` diffs empty; `PickerBar.svelte`'s
  only change is its own internal imports of the four picker packages,
  now scoped) — a pure package-name rename, not a behavioural change.
  Every form's `package.json` dependency keys and every import statement
  (including `medical-language-speaking-assessment-for-cymraeg`'s four
  separate picker tags and every form's `share-targets.ts`) updated;
  `formexamples.github.io/` (its own separate, npm-based dependency on
  `theme-picker`/`text-size-picker`/`share-picker`, unrelated to the
  `forms/` fleet) updated too. Tool: `bin/svelte-lily-scope-rename
  --check|--apply`.
- **2026-09-16 — moved off vendoring onto real pnpm dependencies, and
  consolidated the four pickers behind `PickerBar`.** Every form's
  `src/lib/components/ui/{Theme,Locale,TextSize,Share}Picker.svelte` (and
  `locales.ts`) deleted; `package.json` gets the four picker packages plus
  `lily-design-system-svelte-picker-bar` (renamed the next day, above) as
  real dependencies. In every
  form whose root `+layout.svelte` matched the fleet's standard
  four-picker header block (355/356), that block became a single
  `<PickerBar>`, fed a new `SHARE_TARGETS` array from a vendored
  `src/lib/config/share-targets.ts` (copy link, email, LinkedIn, Reddit,
  Bluesky, Mastodon). `medical-language-speaking-assessment-for-cymraeg`
  drives the pickers through its own i18n store and keeps four separate
  tags, now importing from the real packages rather than a vendored copy.
  Tool: `bin/svelte-lily-pnpm-migrate --check|--apply`. This also touched
  the generic `lily-design-system-svelte-headless` catalogue (21 of the
  ~26 candidate primitives per form swapped to real imports fleet-wide;
  see `lily-svelte-version.md`).
- **2026-08-13 — re-synced all five helpers to pick up upstream
  accessibility fixes; zero `svelte-check` warnings fleet-wide.**
  `ThemePicker`/`LocalePicker`/`TextSizePicker`/`SharePicker` picked up
  upstream's 2026-07-30 "accessibility hardening" commit (`d008096`,
  already past the prior 2026-07-28 pin but never re-synced): each
  option `<li>`'s `a11y_click_events_have_key_events` warning is now
  suppressed with a `svelte-ignore` + comment explaining the
  `aria-activedescendant` listbox pattern (keyboard handling lives on
  the `<ul>`, not per-option), and `SharePicker`'s `<ul>` similarly
  suppresses `a11y_no_noninteractive_element_interactions` for the same
  reason. `DateTimePicker` additionally picked up a same-day fix,
  `untrack()`ing `initialAnchor`'s one-shot read of `mode`/`value` to
  silence `state_referenced_locally` without changing behavior (the read
  was already documented as intentionally non-reactive). No class hooks,
  layout wiring, or CSS changed — pure component-content resync. Tools:
  `bin/svelte-helpers-picker-rename --apply` (re-run; still idempotent
  for the rename it was written for, but also re-copies component
  content on any upstream diff) and `bin/svelte-date-time-picker-vendor
  --apply`.
- **2026-07-28 — vendored the fifth helper, `DateTimePicker`, fleet-wide
  (unwired).** `bin/svelte-date-time-picker-vendor` copies
  `DateTimePicker.svelte` into every form's `src/lib/components/ui/`,
  matching the existing four; `bin/html-date-time-picker-vendor` adds a
  hand-authored `js/date-time-picker.js` (this repo's vanilla-JS
  reimplementation, matching `share-picker.js`/`text-size-picker.js`'s
  style rather than Lily's HTML custom-element package — the same
  translation the HTML side already does for every helper). Neither tool
  touches `+layout.svelte`, any route, `index.html`, or `dashboard.html` —
  see the vendor-only rationale above.
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
