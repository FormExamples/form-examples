# ItaliaCodiceFiscaleInput

A headless input for Italy's Codice fiscale (CF). Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="italia-codice-fiscale-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Italy Codice fiscale.
- Administrative, clinical, or tax/healthcare workflows.

## When not to use it

- For read-only display, use `ItaliaCodiceFiscaleView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.italia-codice-fiscale-input`.

## References

- https://en.wikipedia.org/wiki/Italian_fiscal_code
