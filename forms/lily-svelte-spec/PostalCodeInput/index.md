# PostalCodeInput

A headless text input for postal or ZIP codes. Renders a native `<input type="text">` (so alphanumeric codes like UK postcodes work) with `autocomplete="postal-code"` for browser autofill.

## What it is

- Component: `PostalCodeInput`
- HTML element: `<input type="text">`
- Role: implicit textbox
- Category: form input (input half of the Input/View pattern)

## What it does

- Renders a plain text input pre-wired for postal codes.
- Applies `autocomplete="postal-code"` for browser address autofill.
- Exposes `bind:value` for two-way data binding.
- Forwards `required`, `disabled`, and all other attributes onto the `<input>`.

## When to use it

- Address forms, checkout, and shipping calculators.
- Any field capturing a postal, ZIP, or postcode value.
- Forms where you want to support alphanumeric codes (e.g. UK `SW1A 1AA`) and dashes (e.g. US ZIP+4 `90210-1234`).

## When not to use it

- For displaying an existing postal code as read-only — use `PostalCodeView`.
- For generic free-form text — use `TextInput`.
- For numeric-only quantities — use `NumberInput`.

## How to use it

Import and bind a string value. Add `pattern`, `placeholder`, and `maxlength` via `restProps` for locale-specific formats.

```svelte
import PostalCodeInput from './PostalCodeInput.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `postal-code-input`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: string, default `""`. Bindable with `bind:value`.
- `required`: boolean, default `false`.
- `disabled`: boolean, default `false`.
- `...restProps`: spread onto the `<input>` (e.g. `pattern`, `placeholder`, `maxlength`).

## Usage

### Basic example

```svelte
<script lang="ts">
  import PostalCodeInput from './PostalCodeInput.svelte';

  let postcode = $state("");
</script>

<PostalCodeInput label="Postal code" bind:value={postcode} />
```

### Required ZIP code

```svelte
<script lang="ts">
  import PostalCodeInput from './PostalCodeInput.svelte';

  let zip = $state("");
</script>

<PostalCodeInput label="ZIP code" bind:value={zip} required />
```

### UK postcode with a placeholder

```svelte
<script lang="ts">
  import PostalCodeInput from './PostalCodeInput.svelte';

  let postcode = $state("");
</script>

<PostalCodeInput label="Postcode" bind:value={postcode} placeholder="SW1A 1AA" />
```

### With a locale-specific pattern

```svelte
<script lang="ts">
  import PostalCodeInput from './PostalCodeInput.svelte';
</script>

<!-- US ZIP or ZIP+4 -->
<PostalCodeInput label="ZIP" pattern="\d{5}(-\d{4})?" placeholder="90210" />
```

### Toggling between input and view

```svelte
<script lang="ts">
  import PostalCodeInput from './PostalCodeInput.svelte';
  import PostalCodeView from '../PostalCodeView/PostalCodeView.svelte';

  let zip = $state("90210");
  let editing = $state(false);
</script>

{#if editing}
  <PostalCodeInput label="ZIP" bind:value={zip} />
{:else}
  <PostalCodeView text={zip} />
{/if}
<button onclick={() => (editing = !editing)}>Toggle</button>
```

## Accessibility

- `aria-label` provides the accessible name since no visible `<label>` is rendered. Pair with `Field` for a visible label.
- `autocomplete="postal-code"` helps browser autofill and password-manager-style address tools.
- WCAG 2.2 AAA: consumer CSS must supply a visible focus indicator and an error state for `:invalid`.

## Related components

- `PostalCodeView` — read-only display sibling.
- `TextInput` — generic text input.
- `Field`, `Label`, `Hint`, `ErrorMessage` — labeling and messaging wrappers.
