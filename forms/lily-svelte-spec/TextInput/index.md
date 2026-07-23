# TextInput

A single-line text input rendered as a native `<input type="text">` with `aria-label`, bindable `value`, and optional `required`/`disabled` attributes.

## What it is

`TextInput` is a headless Svelte 5 component that wraps `<input type="text">`. It provides two-way-bound `value` and an accessible name via `aria-label`, with no visual styling.

## What it does

- Renders `<input type="text" class="text-input {className}">`.
- Sets `aria-label={label}` for accessible naming.
- Binds `value` via `bind:value`.
- Forwards `required` and `disabled`.
- Spreads additional HTML attributes onto the `<input>` (e.g. `placeholder`, `maxlength`, `pattern`, `id`, `autocomplete`).

## When to use it

- Entering short text values like names, titles, or brief free-form strings.
- Form fields without a specialized input type.
- As the inner input when composing larger form primitives or custom wrappers.

## When not to use it

- Don't use it for passwords — use `PasswordInput` or `PasswordInputOrTextInputDiv`.
- Don't use it for email — use `EmailInput`.
- Don't use it for phone numbers — use `TelInput`.
- Don't use it for URLs — use `UrlInput`.
- Don't use it for multi-line content — use `TextAreaInput`.

## How to use it

Import and bind `value`. Supply a translated `label`. Extend with placeholder/pattern/maxlength via rest-props.

## Props

- `class` — string, optional. Extra CSS class appended to `text-input`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. Input value.
- `required` — boolean, default `false`. Whether the field is required.
- `disabled` — boolean, default `false`. Whether the field is disabled.
- `...restProps` — any additional HTML attributes spread onto the `<input>`.

## Usage

```svelte
<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let name = $state("");
</script>

<TextInput label="Full name" bind:value={name} />
```

```svelte
<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let email = $state("");
</script>

<TextInput label="Email" bind:value={email} required placeholder="you@example.com" />
```

```svelte
<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let notes = $state("Read-only");
</script>

<TextInput label="Notes" bind:value={notes} disabled />
```

```svelte
<script lang="ts">
  import TextInput from "./TextInput.svelte";

  let zip = $state("");
</script>

<TextInput
  label="ZIP code"
  bind:value={zip}
  pattern="[0-9]{5}"
  maxlength={5}
  inputmode="numeric"
/>
```

## Accessibility

- `aria-label` provides the accessible name since no visible `<label>` is included — always pass a translated string.
- Native `<input type="text">` handles focus, Tab order, and text editing keys.
- `required` and `disabled` states are conveyed to assistive technology natively.

## Related components

- `TextAreaInput` — multi-line equivalent.
- `TextInputWithSearch` — text input plus a search button.
- `PasswordInput` / `EmailInput` / `TelInput` / `UrlInput` / `NumberInput` — type-specialized variants.
- `Field` — wrapper with visible label, hint, and error.

---

Lily™ and Lily Design System™ are trademarks.
