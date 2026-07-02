# BulgariaEdinenGrazhdanskiNomerView

A headless read-only display for Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN). Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="bulgaria-edinen-grazhdanski-nomer-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Bulgaria Единен граждански номер / Edinen grazhdanski nomer read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `BulgariaEdinenGrazhdanskiNomerInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.bulgaria-edinen-grazhdanski-nomer-view`.

## References

- https://en.wikipedia.org/wiki/Unique_citizenship_number
