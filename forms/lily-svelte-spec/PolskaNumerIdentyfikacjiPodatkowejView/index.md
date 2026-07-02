# PolskaNumerIdentyfikacjiPodatkowejView

A headless read-only display for Poland's Numer Identyfikacji Podatkowej (NIP). Format: 10 numeric digits used for tax identification.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="polska-numer-identyfikacji-podatkowej-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Poland Numer Identyfikacji Podatkowej read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `PolskaNumerIdentyfikacjiPodatkowejInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.polska-numer-identyfikacji-podatkowej-view`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Poland
