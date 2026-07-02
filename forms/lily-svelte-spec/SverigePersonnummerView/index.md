# SverigePersonnummerView

A headless read-only display for Sweden's Personnummer. Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="sverige-personnummer-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Sweden Personnummer read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `SverigePersonnummerInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.sverige-personnummer-view`.

## References

- https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)
