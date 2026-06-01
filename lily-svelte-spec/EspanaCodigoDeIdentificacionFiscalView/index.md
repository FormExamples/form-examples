# EspanaCodigoDeIdentificacionFiscalView

A headless read-only display for Spain's Código de Identificación Fiscal (CIF). Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="espana-codigo-de-identificacion-fiscal-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Spain Código de Identificación Fiscal read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `EspanaCodigoDeIdentificacionFiscalInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.espana-codigo-de-identificacion-fiscal-view`.

## References

- https://en.wikipedia.org/wiki/VAT_identification_number#Spain
