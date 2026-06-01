# NorgeFodselsnummerView

A headless read-only display for Norway's Fødselsnummer. Format: 11 digits where the first 6 represent the date of birth (DDMMYY).

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="norge-fodselsnummer-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Norway Fødselsnummer read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `NorgeFodselsnummerInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.norge-fodselsnummer-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Norway
