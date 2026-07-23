# AlbaCommunityHealthIndexInput

A headless input for Scotland's Community Health Index (CHI). Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="alba-community-health-index-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Scotland Community Health Index.
- Administrative, clinical, or healthcare workflows.

## When not to use it

- For read-only display, use `AlbaCommunityHealthIndexView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.alba-community-health-index-input`.

## References

- https://en.wikipedia.org/wiki/National_Health_Service_Central_Register

---

Lily™ and Lily Design System™ are trademarks.
