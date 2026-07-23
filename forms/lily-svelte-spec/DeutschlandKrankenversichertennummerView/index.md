# DeutschlandKrankenversichertennummerView

A headless read-only display for Germany's Krankenversichertennummer (KVNR). Format: a random capital letter followed by eight random digits and a Luhn check digit.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="deutschland-krankenversichertennummer-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Germany Krankenversichertennummer read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `DeutschlandKrankenversichertennummerInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.deutschland-krankenversichertennummer-view`.

## References

- https://de.wikipedia.org/wiki/Krankenversichertennummer

---

Lily™ and Lily Design System™ are trademarks.
