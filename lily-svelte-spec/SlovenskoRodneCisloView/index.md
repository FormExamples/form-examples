# SlovenskoRodneCisloView

A headless read-only display for Slovakia's Rodné číslo (RČ). Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="slovensko-rodne-cislo-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Slovakia Rodné číslo read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `SlovenskoRodneCisloInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.slovensko-rodne-cislo-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Slovakia
