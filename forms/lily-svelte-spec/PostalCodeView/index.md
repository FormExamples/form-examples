# PostalCodeView

A headless read-only display of a postal or ZIP code rendered inside a `<span>`. Paired with `PostalCodeInput` as the view half of the Input/View pattern.

## What it is

- Component: `PostalCodeView`
- HTML element: `<span>`
- Role: inline text
- Category: view (read-only half of the Input/View pattern)

## What it does

- Renders the supplied `text` verbatim inside a `<span>`.
- Spreads additional attributes onto the `<span>`.
- Applies no formatting, validation, or styling — the consumer supplies the already-formatted value.

## When to use it

- Address displays, order confirmations, shipping summaries, and account profile views.
- Inline placement within sentences or summary lists.

## When not to use it

- To edit the value — use `PostalCodeInput`.
- For generic inline text — use a raw `<span>`.
- Where a semantic label/landmark is required — wrap in `SummaryListItem` or `Field`.

## How to use it

Import and pass the postal code through the `text` prop.

```svelte
import PostalCodeView from './PostalCodeView.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `postal-code-view`.
- `text`: string, default `""`. The postal code to display.
- `...restProps`: spread onto the `<span>`.

Note: unlike most `*View` components in this library, this one uses `text` (not `value`) and does not apply an `aria-label`.

## Usage

### US ZIP code

```svelte
<script lang="ts">
  import PostalCodeView from './PostalCodeView.svelte';
</script>

<PostalCodeView text="90210" />
```

### UK postcode

```svelte
<script lang="ts">
  import PostalCodeView from './PostalCodeView.svelte';
</script>

<PostalCodeView text="SW1A 1AA" />
```

### Inline with surrounding text

```svelte
<script lang="ts">
  import PostalCodeView from './PostalCodeView.svelte';

  let postcode = $state("EC1A 1BB");
</script>

<p>Your postal code: <PostalCodeView text={postcode} /></p>
```

### Paired with the input counterpart

```svelte
<script lang="ts">
  import PostalCodeInput from '../PostalCodeInput/PostalCodeInput.svelte';
  import PostalCodeView from './PostalCodeView.svelte';

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

### With a test hook

```svelte
<PostalCodeView text="90210" data-testid="shipping-zip" />
```

## Accessibility

- The `<span>` is inline text and reads naturally with surrounding content.
- The component does not set `aria-label`; if you need an announced name, wrap in a labeled container or wrap the value in another descriptive element.
- Not focusable; no keyboard interaction.

## Related components

- `PostalCodeInput` — editable form sibling for the same postal code.
- `SummaryList`, `SummaryListItem` — common containers for address fields.
- Other read-only view components: `NorthernIrelandHealthAndCareNumberView`, `NetPromoterScoreView`, `RedAmberGreenView`.

---

Lily™ and Lily Design System™ are trademarks.
