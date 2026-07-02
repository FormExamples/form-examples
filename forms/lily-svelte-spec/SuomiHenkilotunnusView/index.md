# SuomiHenkilotunnusView

A headless read-only display for Finland's Henkilötunnus (HETU). Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="suomi-henkilotunnus-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Finland Henkilötunnus read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `SuomiHenkilotunnusInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.suomi-henkilotunnus-view`.

## References

- https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)
