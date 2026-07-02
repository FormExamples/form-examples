# BelgiqueNumeroDeRegistreNationalView

A headless read-only display for Belgium's Numéro de Registre National / Rijksregisternummer (NRN). Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="belgique-numero-de-registre-national-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Belgium Numéro de Registre National / Rijksregisternummer read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `BelgiqueNumeroDeRegistreNationalInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.belgique-numero-de-registre-national-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Belgium
