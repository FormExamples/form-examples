# PortugalPassaporteView

A headless read-only display for Portugal's Passaporte. Format: 1 letter [A-Z] and 6 digits [0-9].

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="portugal-passaporte-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Portugal Passaporte read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `PortugalPassaporteInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.portugal-passaporte-view`.

## References

- https://en.wikipedia.org/wiki/Portuguese_passport
