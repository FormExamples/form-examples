# MaltaNationalIdentificationNumberView

A headless read-only display for Malta's Malta National Identification Number. Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="malta-national-identification-number-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Malta Malta National Identification Number read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `MaltaNationalIdentificationNumberInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.malta-national-identification-number-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Malta
