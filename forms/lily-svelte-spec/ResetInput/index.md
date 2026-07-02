# ResetInput

A headless form-reset button using the native HTML `<input type="reset">` element. When clicked inside a `<form>`, it resets all sibling form fields to their default values.

## What it is

- Component: `ResetInput`
- HTML element: `<input type="reset">`
- Role: implicit `button`
- Category: form control

## What it does

- Renders an `<input type="reset">` whose `value` attribute is both the visible text and the accessible name.
- Uses native browser form-reset behavior; no custom JavaScript logic.
- Supports `disabled` and spreads any other attributes onto the `<input>`.

## When to use it

- Long forms where users want to clear all entered data and start over.
- Administrative or configuration forms where "restore defaults" is a meaningful action.

## When not to use it

- To submit the form — use `SubmitInput` or `<button type="submit">`.
- For a free-form clickable button — use `Button` or `ButtonInput`.
- To reset a single field — handle it in the consumer's state rather than using a form reset, which clears every sibling.
- Some UX guidance recommends avoiding reset buttons on short forms because accidental clicks are costly — consider whether a reset affordance is needed at all.

## How to use it

Import and place inside a `<form>`. Override `value` to localize the button text.

```svelte
import ResetInput from './ResetInput.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `reset-input`.
- `value`: string, default `"Reset"`. Visible button text (and accessible name).
- `disabled`: boolean, default `false`.
- `...restProps`: spread onto the `<input>`.

## Usage

### Default label

```svelte
<script lang="ts">
  import ResetInput from './ResetInput.svelte';
</script>

<form>
  <!-- fields -->
  <ResetInput />
</form>
```

### Custom label

```svelte
<script lang="ts">
  import ResetInput from './ResetInput.svelte';
</script>

<form>
  <ResetInput value="Clear form" />
</form>
```

### Conditionally disabled

```svelte
<script lang="ts">
  import ResetInput from './ResetInput.svelte';

  let dirty = $state(false);
  let name = $state("");
  $effect(() => { dirty = name.length > 0; });
</script>

<form>
  <label>Name <input bind:value={name} /></label>
  <ResetInput value="Start over" disabled={!dirty} />
</form>
```

### Alongside a submit input

```svelte
<script lang="ts">
  import ResetInput from './ResetInput.svelte';
  import SubmitInput from '../SubmitInput/SubmitInput.svelte';
</script>

<form>
  <label>Subject <input type="text" /></label>
  <label>Body <textarea></textarea></label>
  <SubmitInput value="Send" />
  <ResetInput value="Discard" />
</form>
```

### Localized label

```svelte
<script lang="ts">
  import ResetInput from './ResetInput.svelte';
</script>

<ResetInput value="Réinitialiser" />
```

## Accessibility

- Native `<input type="reset">` has an implicit `button` role; the `value` attribute serves as the accessible name.
- Keyboard: Enter and Space activate the button (native behavior).
- WCAG 2.2 AAA: consumer CSS must provide a visible focus indicator. Consider whether the reset action warrants a confirmation to prevent catastrophic data loss on accidental click.

## Related components

- `SubmitInput` — submit-type form button.
- `ButtonInput` — generic `<input type="button">`.
- `Button` — `<button>` element variant.
- `Form`, `Field`, `Fieldset` — form composition wrappers.
