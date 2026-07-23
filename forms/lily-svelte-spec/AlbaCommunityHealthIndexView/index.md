# AlbaCommunityHealthIndexView

A headless read-only display for Scotland's Community Health Index (CHI). Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="alba-community-health-index-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Scotland Community Health Index read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `AlbaCommunityHealthIndexInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.alba-community-health-index-view`.

## References

- https://en.wikipedia.org/wiki/National_Health_Service_Central_Register

---

Lily™ and Lily Design System™ are trademarks.
