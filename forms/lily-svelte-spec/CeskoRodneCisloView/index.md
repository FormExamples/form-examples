# CeskoRodneCisloView

A headless read-only display for Czech Republic's Rodné číslo (RČ). Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="cesko-rodne-cislo-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Czech Republic Rodné číslo read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `CeskoRodneCisloInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.cesko-rodne-cislo-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

---

Lily™ and Lily Design System™ are trademarks.
