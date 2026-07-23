# CeskoCestovniPasView

A headless read-only display for Czech Republic's Cestovní pas. Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="cesko-cestovni-pas-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Czech Republic Cestovní pas read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `CeskoCestovniPasInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.cesko-cestovni-pas-view`.

## References

- https://en.wikipedia.org/wiki/Czech_passport

---

Lily™ and Lily Design System™ are trademarks.
