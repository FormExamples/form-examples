# CyprusNationalPassportNumberView

A headless read-only display for Cyprus's National Passport Number. Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678).

## What it is

A Svelte 5 component that renders an inline `<span>` element with an accessible label suitable for patient records, summaries, or any context where the identifier needs to be displayed but not edited.

## What it does

- Renders `<span class="cyprus-national-passport-number-view ...">{value}</span>`.
- Sets `aria-label={label}` for screen reader name.
- Renders the `value` prop as text content.

## When to use it

- Display a stored Cyprus National Passport Number read-only.
- Summary lists, patient records, audit logs, detail views.

## When not to use it

- For editing, use `CyprusNationalPassportNumberInput`.
- For general text display, use a `<span>` directly.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.cyprus-national-passport-number-view`.

## References

- https://en.wikipedia.org/wiki/Cypriot_passport
