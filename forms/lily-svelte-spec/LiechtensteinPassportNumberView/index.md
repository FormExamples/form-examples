# LiechtensteinPassportNumberView

A headless read-only display for Liechtenstein's Liechtenstein Passport Number. Format: 1 letter followed by 5 digits (e.g. R00536).

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="liechtenstein-passport-number-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Liechtenstein Liechtenstein Passport Number read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `LiechtensteinPassportNumberInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.liechtenstein-passport-number-view`.

## References

- https://en.wikipedia.org/wiki/Liechtenstein_passport
