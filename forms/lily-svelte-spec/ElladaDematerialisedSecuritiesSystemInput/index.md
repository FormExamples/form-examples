# ElladaDematerialisedSecuritiesSystemInput

A headless input for Greece's Dematerialised Securities System (DSS). Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="ellada-dematerialised-securities-system-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Greece Dematerialised Securities System.
- Administrative, clinical, or securities workflows.

## When not to use it

- For read-only display, use `ElladaDematerialisedSecuritiesSystemView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.ellada-dematerialised-securities-system-input`.

## References

- https://en.wikipedia.org/wiki/Central_Securities_Depository

---

Lily™ and Lily Design System™ are trademarks.
