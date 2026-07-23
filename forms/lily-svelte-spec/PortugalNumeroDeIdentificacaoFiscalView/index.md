# PortugalNumeroDeIdentificacaoFiscalView

A headless read-only display for Portugal's Número de Identificação Fiscal (NIF). Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="portugal-numero-de-identificacao-fiscal-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Portugal Número de Identificação Fiscal read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `PortugalNumeroDeIdentificacaoFiscalInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.portugal-numero-de-identificacao-fiscal-view`.

## References

- https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

---

Lily™ and Lily Design System™ are trademarks.
