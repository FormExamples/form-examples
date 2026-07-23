# Label

Label is a headless Svelte 5 component that renders a native HTML `<label>` element to provide a descriptive name or instruction for an associated form control such as an input field, checkbox, or radio button.

## What it is

A thin wrapper around the native `<label>` element. Clicking the label text focuses or activates the associated form control via native browser behaviour, and screen readers announce the label when the control receives focus.

## What it does

- Renders a `<label>` with `class="label"` plus any consumer-provided CSS class.
- Forwards the reserved `for` attribute via an internally renamed `forProp` prop.
- Renders the required `children` snippet as the label text content.
- Spreads `...restProps` onto the `<label>` for consumer customization.

## When to use it

- Providing a visible, clickable label for any form control that has an `id`.
- Wrapping a form control so that clicking anywhere on the label focuses the control.
- Pairing with `TextInput`, `EmailInput`, `CheckboxInput`, `RadioInput`, `Select`, `TextAreaInput`, etc.

## When not to use it

- Do not use when only an invisible accessible name is needed — use the `label` prop on the input components (they apply `aria-label`).
- Do not use without either a `for` attribute or a wrapped form control — labels must be associated with a control.
- Do not use to label non-form elements — use a heading or `aria-labelledby` for those.

## How to use it

Either link the label to a control by `for` matching the control's `id`, or wrap the control inside the label element.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `label` class.
- `for` (string, optional) — the `id` of the associated form control (HTML `for` attribute).
- `children` (Snippet, required) — the label text content.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<label>`.

## Usage

### Label linked by `for` attribute

```svelte
<script lang="ts">
    import Label from "./Label.svelte";
</script>

<Label for="email">Email address</Label>
<input id="email" type="email" />
```

### Label wrapping a form control (no `for` needed)

```svelte
<script lang="ts">
    import Label from "./Label.svelte";
</script>

<Label>
    Email address
    <input type="email" />
</Label>
```

### Label with a required indicator

```svelte
<script lang="ts">
    import Label from "./Label.svelte";
</script>

<Label for="name">
    Name <span aria-hidden="true">*</span>
    <span class="visually-hidden">required</span>
</Label>
<input id="name" type="text" required />
```

### Label pairing with CheckboxInput

```svelte
<script lang="ts">
    import Label from "./Label.svelte";
    import CheckboxInput from "../CheckboxInput/CheckboxInput.svelte";
    let agreed = $state(false);
</script>

<Label for="agree">I agree to the terms</Label>
<CheckboxInput id="agree" label="I agree to the terms" bind:checked={agreed} />
```

### Label with a consumer CSS class

```svelte
<script lang="ts">
    import Label from "./Label.svelte";
</script>

<Label class="label-strong" for="zip">ZIP code</Label>
<input id="zip" type="text" />

<style>
    :global(.label-strong) {
        font-weight: 600;
        display: block;
        margin-bottom: 0.25rem;
    }
</style>
```

## Accessibility

- Native `<label>` with `for` provides an implicit accessible name for the linked form control.
- Clicking the label focuses or toggles its associated control (native browser behaviour).
- No additional ARIA needed — semantic HTML `<label>` is fully recognised by assistive technology.
- Compliant with WCAG 2.2 AAA when paired with a sufficient visible focus indicator.

## Related components

- `TextInput`, `EmailInput`, `PasswordInput`, `NumberInput`, `SearchInput`, `UrlInput`, `TelInput` — form inputs to label.
- `CheckboxInput`, `RadioInput` — toggle inputs.
- `Select`, `TextAreaInput` — selection and multi-line inputs.
- `Field` — a form field wrapper that bundles a label, input, hint, and error message.
- `Fieldset` — a group of related form fields with a legend.
- `Form` — the form container.

---

Lily™ and Lily Design System™ are trademarks.
