# ElladaDematerialisedSecuritiesSystemView

A headless read-only display for Greece's Dematerialised Securities System (DSS). Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="ellada-dematerialised-securities-system-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Greece Dematerialised Securities System read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `ElladaDematerialisedSecuritiesSystemInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.ellada-dematerialised-securities-system-view`.

## References

- https://en.wikipedia.org/wiki/Central_Securities_Depository

---

Lily™ and Lily Design System™ are trademarks.
