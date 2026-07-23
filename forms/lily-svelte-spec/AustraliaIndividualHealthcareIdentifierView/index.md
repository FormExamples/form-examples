# AustraliaIndividualHealthcareIdentifierView

A headless read-only display for Australia's Individual Healthcare Identifier (IHI). Format: 16 digits assigned by the Healthcare Identifiers Service.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="australia-individual-healthcare-identifier-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Australia Individual Healthcare Identifier read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `AustraliaIndividualHealthcareIdentifierInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.australia-individual-healthcare-identifier-view`.

## References

- https://en.wikipedia.org/wiki/My_Health_Record

---

Lily™ and Lily Design System™ are trademarks.
