# Field

A form field wrapper that pairs a visible label with a form control, optional description text, a required indicator, and an inline error message.

## What it is

`Field` is a headless composition primitive for labelling and describing a form control. It renders a `<div>` containing a `<label for>`, optional `<p>` description, the consumer-provided form control (passed as children), and an optional `<p role="alert">` error message. Both description and error elements are rendered only when their corresponding props are set.

## What it does

- Renders a wrapping `<div data-required>`.
- Renders `<label for={fieldId}>{label}<span aria-hidden>*</span></label>`.
- Renders an optional `<p id={descId}>{description}</p>`.
- Renders the child control via `{@render children()}`.
- Renders an optional `<p id={errorId} role="alert">{error}</p>`.
- Auto-generates `fieldId`, `descId`, `errorId` via `$derived()` when `inputId` is not provided.

## When to use it

- Wrapping any form control (text input, select, checkbox, text-area-input, date input, custom widget).
- When you want a canonical label/description/error layout with accessible IDs wired up.
- Within a broader `Form` composition.

## When not to use it

- When you only need a label without description or error. A plain `<label>` works.
- For fieldset-level grouping of related controls. Use `Fieldset` instead.
- For the error summary at the top of a form. Use `ErrorSummary`.

## How to use it

Place an input inside `Field`. Supply the input's `id` so the `<label for>` binding works; `Field` auto-generates an ID if you omit `inputId`.

```svelte
<script lang="ts">
    import Field from "./Field.svelte";
    import TextInput from "../TextInput/TextInput.svelte";
    let name = $state("");
</script>

<Field label="Name" description="Enter your full name" inputId="name">
    <TextInput id="name" label="Name" bind:value={name} />
</Field>
```

## Props

| Prop          | Type       | Default     | Description                                     |
| ------------- | ---------- | ----------- | ----------------------------------------------- |
| `class`       | `string`   | `""`        | CSS class appended to the base class.          |
| `label`       | `string`   | required    | Visible label text.                             |
| `description` | `string`   | `undefined` | Helper text below the label.                    |
| `error`       | `string`   | `undefined` | Inline error message below the input.           |
| `required`    | `boolean`  | `false`     | Adds a visual `*` (hidden from AT).             |
| `inputId`     | `string`   | `undefined` | ID of the inner input; auto-generated if absent.|
| `children`    | `Snippet`  | required    | Form control markup.                            |
| `...rest`     | `unknown`  | —           | Additional HTML attributes on the wrapper.      |

## Usage

### 1. Wrapping a TextInput

```svelte
<Field label="Name" inputId="name">
    <TextInput id="name" label="Name" bind:value={name} />
</Field>
```

### 2. Required with description

```svelte
<Field
    label="Email"
    description="We'll send your confirmation here"
    required
    inputId="email"
>
    <EmailInput id="email" label="Email" bind:value={email} required />
</Field>
```

### 3. With an error message

```svelte
<Field label="Password" required error={errors.password} inputId="password">
    <PasswordInput id="password" label="Password" bind:value={password} />
</Field>
```

### 4. With a Select

```svelte
<Field label="Country" inputId="country">
    <Select id="country" label="Country" bind:value={country}>
        <option value="us">United States</option>
        <option value="es">Spain</option>
    </Select>
</Field>
```

### 5. Auto-generated ID

```svelte
<Field label="Notes">
    <TextAreaInput label="Notes" bind:value={notes} />
</Field>
<!-- Field auto-generates fieldId and sets <label for>; the text-area-input is focused via <label> click. -->
```

## Accessibility

- `<label for={fieldId}>` links the label to the input.
- The required asterisk is wrapped in `<span aria-hidden="true">` so screen readers don't say "star".
- The error paragraph uses `role="alert"` for immediate announcement.
- `data-required` exposes the required state for consumer CSS.

## Related components

- `Fieldset` — groups related fields with a `<legend>`.
- `ErrorSummary` — summary of all form errors at the top of the form.
- `ErrorMessage`, `Hint`, `Label` — lower-level pieces.
- `Form` — top-level form wrapper.

---

Lily™ and Lily Design System™ are trademarks.
