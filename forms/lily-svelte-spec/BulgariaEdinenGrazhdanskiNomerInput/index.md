# BulgariaEdinenGrazhdanskiNomerInput

A headless input for Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN). Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `autocomplete="off"` to protect the sensitive identifier.

## What it does

- Renders `<input class="bulgaria-edinen-grazhdanski-nomer-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `autocomplete="off"` to prevent browser autofill.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a Bulgaria Единен граждански номер / Edinen grazhdanski nomer.
- Administrative, clinical, or national-id workflows.

## When not to use it

- For read-only display, use `BulgariaEdinenGrazhdanskiNomerView`.
- For other countries, use the matching country-specific input.

## Headless

This component ships zero CSS. The consumer provides all styling targeting `.bulgaria-edinen-grazhdanski-nomer-input`.

## References

- https://en.wikipedia.org/wiki/Unique_citizenship_number
