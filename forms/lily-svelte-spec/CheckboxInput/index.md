# CheckboxInput

A minimal headless wrapper around the native `<input type="checkbox">` element. It uses `aria-label` instead of a wrapping `<label>`, giving consumers full control over label placement and visual composition. The `checked` prop is bindable for two-way binding.

## What it is

CheckboxInput renders a single `<input type="checkbox">` element with no wrapper. Its `checked` prop uses Svelte 5's `$bindable()` for two-way binding, and the `label` prop is applied as `aria-label`.

## What it does

- Renders `<input type="checkbox" aria-label={label} />`.
- Supports two-way binding on `checked` via `bind:checked`.
- Forwards `disabled`, `required`, `name`, `id`, `value` to the native input.
- Spreads `restProps` onto the input.

## When to use it

- When you need a bare checkbox and want to position your own visible label.
- Integrating into custom layouts (label left, label right, icon indicator).
- Inside `CheckboxGroup` or other custom wrappers that supply their own labels.

## When not to use it

- When you want a standard `<label><input /></label>` pairing — write that directly, or use `CheckListItem`.
- For a switch control — use `SwitchButton`.
- For a form field with validation and hint text — use `Field`.

## How to use it

Bind the `checked` prop for reactivity. Provide `label` for accessibility. Wrap with your own visible `<label>` if needed — the visible label can coexist with `aria-label`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `checked` | `boolean` | `false` (bindable) | Current checked state. |
| `label` | `string` | required | `aria-label` for the checkbox. |
| `disabled` | `boolean` | `false` | Disables the checkbox. |
| `required` | `boolean` | `false` | Marks the checkbox as required. |
| `name` | `string` | `undefined` | Form field name. |
| `id` | `string` | `undefined` | Element ID. |
| `value` | `string` | `undefined` | Value attribute for form submission. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<input>`. |

## Usage

```svelte
<script lang="ts">
    import CheckboxInput from "./CheckboxInput.svelte";

    let accepted = $state(false);
</script>

<CheckboxInput label="Accept terms" bind:checked={accepted} />
```

```svelte
<script lang="ts">
    import CheckboxInput from "./CheckboxInput.svelte";

    let subscribed = $state(false);
    let hasEmail = $state(true);
</script>

<CheckboxInput
    label="Subscribe to newsletter"
    bind:checked={subscribed}
    disabled={!hasEmail}
/>
```

```svelte
<script lang="ts">
    import CheckboxInput from "./CheckboxInput.svelte";

    let agree = $state(false);
</script>

<CheckboxInput label="I agree" bind:checked={agree} required name="agree" value="yes" />
```

```svelte
<script lang="ts">
    import CheckboxInput from "./CheckboxInput.svelte";

    let remember = $state(true);
    const id = "remember-me";
</script>

<CheckboxInput {id} label="Remember me" bind:checked={remember} />
<label for={id}>Remember me on this device</label>
```

## Accessibility

- The native `<input type="checkbox">` supplies the checkbox role and keyboard support (Space toggles, Tab focus).
- `aria-label` gives the checkbox an accessible name since there is no wrapping `<label>`.
- Pair with a visible `<label for=...>` if sighted users also need the text.

## Related components

- `CheckboxGroup` — groups related checkboxes.
- `CheckListItem` — `<li>`-wrapped checkbox with visible label.
- `SwitchButton` — styled on/off toggle.

---

Lily™ and Lily Design System™ are trademarks.
