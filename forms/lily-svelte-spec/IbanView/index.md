# IbanView

A headless read-only display for an International Bank Account Number (IBAN). Format: Up to 34 letters and digits: a two-letter country code, two check digits, then the national account number.

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="iban-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored IBAN read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `IbanInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.iban-view`.

## References

- https://en.wikipedia.org/wiki/International_Bank_Account_Number

---

Lily™ and Lily Design System™ are trademarks.
