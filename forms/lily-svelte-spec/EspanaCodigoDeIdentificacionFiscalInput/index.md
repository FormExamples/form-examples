# EspanaCodigoDeIdentificacionFiscalInput

A headless input for Spain's Código de Identificación Fiscal (CIF). Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="espana-codigo-de-identificacion-fiscal-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Spain Código de Identificación Fiscal.
- Administrative, clinical, or tax workflows.

## When not to use it

- For read-only display, use `EspanaCodigoDeIdentificacionFiscalView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.espana-codigo-de-identificacion-fiscal-input`.

## References

- https://en.wikipedia.org/wiki/VAT_identification_number#Spain
