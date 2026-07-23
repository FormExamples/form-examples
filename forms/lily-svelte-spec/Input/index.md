# Input

Input is a headless Svelte 5 foundational form input for text entry with accessible labelling and two-way value binding. It renders a native `<input>` element supporting various HTML input types such as `text`, `email`, `password`, `number`, `search`, and more.

## What it is

A thin, unstyled wrapper around the native HTML `<input>` element. It exposes the most common form-input props (label, value, type, required, disabled) and spreads any additional attributes onto the underlying `<input>`.

## What it does

- Renders an `<input>` element with `class="input"` plus any consumer-provided CSS class.
- Applies `aria-label` from the required `label` prop since there is no visible `<label>` element.
- Provides a bindable `value` via `$bindable("")` for two-way data binding.
- Accepts a `type` prop to switch between `text`, `email`, `password`, `number`, `search`, etc.
- Forwards the `required` and `disabled` HTML attributes.
- Spreads `...restProps` onto the `<input>` so consumers can add `placeholder`, `maxlength`, `pattern`, `autocomplete`, etc.

## When to use it

- Basic generic single-line text entry when you do not need the stricter semantics of a `TextInput`.
- Rapidly building forms where you want a single component to cover multiple input types.
- Quick prototypes where you need a raw `<input>` with accessible labelling.
- Wiring up two-way binding with `bind:value` for a reactive form.

## When not to use it

- Do not use when you need a visible `<label>` element — use `Field` with a separate `Label` + `TextInput`.
- Do not use for complex widgets (date, time, colour, range) — prefer the dedicated components (`DateInput`, `TimeInput`, `ColorInput`, `RangeInput`).
- Do not use for sensitive, format-specific values — use `EmailInput`, `PasswordInput`, `UrlInput`, `TelInput`, or regional identifier inputs.
- Do not use without an accessible name — the `label` prop is required.

## How to use it

Import the component, pass a `label` for screen readers, bind the `value`, and optionally set `type`, `required`, or `disabled`. Add placeholder or validation attributes via `restProps`.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `input` class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `value` (string, optional, default `""`) — bindable value via `bind:value`.
- `type` (string, optional, default `"text"`) — HTML input type attribute.
- `required` (boolean, optional, default `false`) — whether the input is required.
- `disabled` (boolean, optional, default `false`) — whether the input is disabled.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<input>`.

## Usage

### Basic text input

```svelte
<script lang="ts">
    import Input from "./Input.svelte";
    let value = $state("");
</script>

<Input label="Search" bind:value />
```

### Required name input

```svelte
<script lang="ts">
    import Input from "./Input.svelte";
    let name = $state("");
</script>

<Input label="Name" bind:value={name} type="text" required />
```

### Email input with disabled state

```svelte
<script lang="ts">
    import Input from "./Input.svelte";
    let email = $state("");
    let isSubmitting = $state(false);
</script>

<Input
    label="Email address"
    bind:value={email}
    type="email"
    required
    disabled={isSubmitting}
/>
```

### Input with placeholder and pattern via restProps

```svelte
<script lang="ts">
    import Input from "./Input.svelte";
    let zip = $state("");
</script>

<Input
    label="ZIP code"
    bind:value={zip}
    type="text"
    placeholder="12345"
    pattern="[0-9]{5}"
    maxlength={5}
/>
```

### Number input for a quantity

```svelte
<script lang="ts">
    import Input from "./Input.svelte";
    let quantity = $state("1");
</script>

<Input
    label="Quantity"
    bind:value={quantity}
    type="number"
    min={1}
    max={99}
/>
```

## Accessibility

- `aria-label` provides an accessible name in the absence of a visible `<label>` element.
- Consumers may add `aria-describedby` via `restProps` to link hint or error text.
- Native `required` and `disabled` attributes are forwarded to the `<input>`.
- Standard browser keyboard behaviour applies (Tab to focus, typing to edit, etc.).
- Compliant with WCAG 2.2 AAA when paired with appropriate focus indicators supplied by the consumer.

## Related components

- `TextInput` — a single-line text input with the same contract but fixed `type="text"`.
- `EmailInput`, `PasswordInput`, `NumberInput`, `SearchInput`, `UrlInput`, `TelInput` — type-specific inputs.
- `Field` — wraps an input with a visible label, hint, and error message.
- `Label` — a standalone `<label>` element linked to an input by `for`.
- `Form` — the form container that collects and submits inputs.

---

Lily™ and Lily Design System™ are trademarks.
