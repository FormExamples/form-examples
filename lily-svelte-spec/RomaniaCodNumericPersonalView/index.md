# RomaniaCodNumericPersonalView

A headless read-only display for Romania's Cod Numeric Personal (CNP). Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="romania-cod-numeric-personal-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Romania Cod Numeric Personal read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `RomaniaCodNumericPersonalInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.romania-cod-numeric-personal-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Romania
