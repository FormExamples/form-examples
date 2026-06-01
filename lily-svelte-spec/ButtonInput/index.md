# ButtonInput

A form button rendered as a native `<input type="button">`. Unlike `Button` (which uses `<button>` and accepts rich children), `ButtonInput` displays plain text only via its `value` attribute.

## What it is

A headless Svelte 5 component. Category: form-control button primitive, alongside `Button`, `SubmitInput`, `ResetInput`, and `ImageInput`.

## What it does

- Renders `<input type="button" class="button-input {className}" value={value} disabled={disabled} name={name} aria-label={label} onclick={onclick}>`.
- Accepts text-only label through the native `value` attribute.
- Passes `disabled` natively (browser suppresses clicks and sets disabled semantics).
- Spreads additional HTML attributes onto the `<input>`.

## When to use it

- Form layouts that prefer `<input>`-based buttons for consistent legacy styling.
- Cases where the button label is always plain text.

## When not to use it

- For buttons with icons or formatted content — use `Button`.
- For submit buttons — use `SubmitInput`.
- For reset buttons — use `ResetInput`.
- For graphical submit buttons — use `ImageInput`.

## How to use it

Import `ButtonInput` from `./ButtonInput.svelte`. Always pass `value`. Optionally add `onclick`, `name`, `label`, or `disabled`.

## Props

- `class` — string, default `""`. CSS class appended to `button-input`.
- `value` — string, required. Visible button text.
- `disabled` — boolean, default `false`.
- `name` — string, optional. Form field name.
- `label` — string, optional. Accessible name override via `aria-label`.
- `onclick` — `(event: MouseEvent) => void`, optional.
- `...restProps` — additional HTML attributes spread onto the `<input>`.

## Usage

### Basic button input

```svelte
<script lang="ts">
  import ButtonInput from './ButtonInput.svelte';

  function handleClick() {
    console.log('clicked');
  }
</script>

<ButtonInput value="Click me" onclick={handleClick} />
```

### Disabled

```svelte
<script lang="ts">
  import ButtonInput from './ButtonInput.svelte';
</script>

<ButtonInput value="Submit" disabled />
```

### Named form field with aria-label override

```svelte
<script lang="ts">
  import ButtonInput from './ButtonInput.svelte';
</script>

<form>
  <ButtonInput value="Save" name="action" label="Save changes to profile" />
</form>
```

### Inside a Field wrapper

```svelte
<script lang="ts">
  import ButtonInput from './ButtonInput.svelte';
  import Field from '../Field/Field.svelte';
</script>

<Field label="Actions">
  <ButtonInput value="Apply" />
</Field>
```

### Reactive disabled based on form state

```svelte
<script lang="ts">
  import ButtonInput from './ButtonInput.svelte';

  let name = $state('');
  let disabled = $derived(name.trim().length === 0);
</script>

<input type="text" bind:value={name} />
<ButtonInput value="Continue" {disabled} />
```

## Accessibility

- Implicit `button` role from `<input type="button">`.
- `aria-label` overrides the name when passed.
- Native `disabled` prevents activation and is exposed to AT.
- Keyboard: Tab focuses; Enter/Space activate (native behavior).

## Related components

- `Button` — richer `<button>`-based variant.
- `SubmitInput` — `<input type="submit">` for form submission.
- `ResetInput` — `<input type="reset">` for form reset.
- `ImageInput` — `<input type="image">` graphical submit.
- `ToggleButton`, `SwitchButton` — stateful buttons.
