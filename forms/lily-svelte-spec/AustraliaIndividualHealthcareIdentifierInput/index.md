# AustraliaIndividualHealthcareIdentifierInput

A headless input for Australia's Individual Healthcare Identifier (IHI). Format: 16 digits assigned by the Healthcare Identifiers Service.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="australia-individual-healthcare-identifier-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Australia Individual Healthcare Identifier.
- Administrative, clinical, or healthcare workflows.

## When not to use it

- For read-only display, use `AustraliaIndividualHealthcareIdentifierView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.australia-individual-healthcare-identifier-input`.

## References

- https://en.wikipedia.org/wiki/My_Health_Record
