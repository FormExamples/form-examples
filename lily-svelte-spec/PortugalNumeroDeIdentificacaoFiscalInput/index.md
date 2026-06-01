# PortugalNumeroDeIdentificacaoFiscalInput

A headless input for Portugal's Número de Identificação Fiscal (NIF). Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="portugal-numero-de-identificacao-fiscal-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Portugal Número de Identificação Fiscal.
- Administrative, clinical, or tax workflows.

## When not to use it

- For read-only display, use `PortugalNumeroDeIdentificacaoFiscalView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.portugal-numero-de-identificacao-fiscal-input`.

## References

- https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)
