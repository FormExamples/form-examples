# EmailInput

A headless email input that wraps a native `<input type="email">` with accessible labelling and a bindable value.

## What it is

`EmailInput` is a thin wrapper around `<input type="email">`. The browser provides email validation, keyboard, and mobile keyboard optimisations; the component contributes `aria-label`, a bindable value, and standard `required`/`disabled` flags.

## What it does

- Renders `<input type="email" aria-label={label}>`.
- Binds `value` via `$bindable()`.
- Forwards `required` and `disabled` to the native input.
- Spreads `restProps` onto the `<input>`.

## When to use it

- Simple email collection in a form where the consumer handles layout, labelling and error rendering externally.
- Registration, sign-in, contact forms.
- Anywhere you need the browser's native email validation and mobile keyboard.

## When not to use it

- For displaying an email address as a link. Use `EmailLink` instead.
- When you need built-in label, hint, and error wrappers. Compose with `Field`.
- For arbitrary text input. Use `TextInput`.

## How to use it

Provide a required `label` and bind a value.

```svelte
<script lang="ts">
    import EmailInput from "./EmailInput.svelte";
    let email = $state("");
</script>

<EmailInput label="Your email" bind:value={email} />
```

## Props

| Prop       | Type      | Default | Description                                  |
| ---------- | --------- | ------- | -------------------------------------------- |
| `class`    | `string`  | `""`    | CSS class appended to the base class.       |
| `label`    | `string`  | required| Accessible name via `aria-label`.            |
| `value`    | `string`  | `""`    | Bindable email value.                        |
| `required` | `boolean` | `false` | Whether the field is required.               |
| `disabled` | `boolean` | `false` | Whether the field is disabled.               |
| `...rest`  | `unknown` | —       | Additional HTML attributes on the `<input>`. |

## Usage

### 1. Basic input

```svelte
<EmailInput label="Your email" bind:value={email} />
```

### 2. Required field

```svelte
<EmailInput label="Contact email" bind:value={email} required />
```

### 3. Inside a Field

```svelte
<Field label="Email" description="We'll never share your email.">
    <EmailInput label="Email" bind:value={email} />
</Field>
```

### 4. Disabled

```svelte
<EmailInput label="Email" value="alice@example.com" disabled />
```

### 5. With name and autocomplete

```svelte
<EmailInput
    label="Email"
    bind:value={email}
    name="email"
    autocomplete="email"
    required
/>
```

## Accessibility

- `aria-label` provides the accessible name because there is no visible `<label>`. For visual labels, wrap with `Field` or associate an external `<label for>`.
- `required` and `disabled` are communicated natively.

## Related components

- `EmailLink` — displays an email address as a clickable `mailto:` link.
- `Field` — label + description + error wrapper around any input.
- `TextInput`, `UrlInput`, `TelInput`, `SearchInput` — sibling input types.

---

Lily™ and Lily Design System™ are trademarks.
