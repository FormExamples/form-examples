# SuomiHenkilotunnusInput

A headless input for Finland's Henkilötunnus (HETU). Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="suomi-henkilotunnus-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Finland Henkilötunnus.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `SuomiHenkilotunnusView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.suomi-henkilotunnus-input`.

## References

- https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)
