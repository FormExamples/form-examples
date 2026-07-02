# CeskoCestovniPasInput

A headless input for Czech Republic's Cestovní pas. Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="cesko-cestovni-pas-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Czech Republic Cestovní pas.
- Administrative, clinical, or passport workflows.

## When not to use it

- For read-only display, use `CeskoCestovniPasView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.cesko-cestovni-pas-input`.

## References

- https://en.wikipedia.org/wiki/Czech_passport
