# PolskaNumerIdentyfikacjiPodatkowejInput

A headless input for Poland's Numer Identyfikacji Podatkowej (NIP). Format: 10 numeric digits used for tax identification.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="polska-numer-identyfikacji-podatkowej-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Poland Numer Identyfikacji Podatkowej.
- Administrative, clinical, or tax workflows.

## When not to use it

- For read-only display, use `PolskaNumerIdentyfikacjiPodatkowejView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.polska-numer-identyfikacji-podatkowej-input`.

## References

- https://en.wikipedia.org/wiki/National_identification_number#Poland
