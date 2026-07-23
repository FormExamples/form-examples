# NetPromoterScorePickerButton

A headless button representing one score choice within a Net Promoter Score picker. Each button carries a numeric NPS value from 0 to 10 and renders as a native `<button>` with `aria-pressed` for the selected state and a `data-value` attribute for CSS targeting.

## What it is

- Component: `NetPromoterScorePickerButton`
- HTML element: `<button type="button">`
- Role: native button; toggled state exposed via `aria-pressed`
- Category: picker sub-component (compound child of `NetPromoterScorePicker`)

## What it does

- Renders a button that represents a single score (0-10) on the NPS scale.
- Exposes the numeric score via `data-value` for consumer CSS selectors.
- Communicates selection state to assistive technology through `aria-pressed`.
- Supports `disabled` through the native button attribute.
- Forwards click events via the `onclick` prop.
- Spreads any additional attributes onto the underlying `<button>`.

## When to use it

- Inside a `NetPromoterScorePicker` that renders each score 0-10 as a button.
- Customer loyalty surveys, post-purchase feedback, satisfaction research.
- Segmentation UIs that need separate Detractor (0-6), Passive (7-8), Promoter (9-10) styling by data attribute.

## When not to use it

- For a dropdown NPS picker: use a native `<select>` element instead.
- To display a read-only NPS score: use `NetPromoterScoreView`.
- For ratings on a different scale: use `FiveStarRatingPickerButton`, `FiveFaceRatingPickerButton`, or `RedAmberGreenPickerButton` as appropriate.
- As a standalone button: this is a compound child; use `Button` for generic buttons.

## How to use it

Import and render one button per NPS score. Typically composed inside `NetPromoterScorePicker` with an `{#each}` block.

```svelte
import NetPromoterScorePickerButton from './NetPromoterScorePickerButton.svelte';
```

Required props: `value`, `label`.

## Props

- `class` (`className`): string, default `""`. Extra CSS class appended to `net-promoter-score-picker-button`.
- `value`: number, required. The NPS score value (0-10).
- `label`: string, required. Accessible name for the button via `aria-label`, also rendered as the visible text.
- `selected`: boolean, default `false`. Whether this score is currently selected; drives `aria-pressed`.
- `disabled`: boolean, default `false`. Disables the button.
- `onclick`: `(event: MouseEvent) => void`, optional. Click handler.
- `...restProps`: any other HTML attributes are spread onto the `<button>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import NetPromoterScorePickerButton from './NetPromoterScorePickerButton.svelte';

  let nps = $state<number | undefined>(undefined);
</script>

<NetPromoterScorePickerButton
  value={9}
  label="9"
  selected={nps === 9}
  onclick={() => (nps = 9)}
/>
```

### Full 0-10 row

```svelte
<script lang="ts">
  import NetPromoterScorePickerButton from './NetPromoterScorePickerButton.svelte';

  let nps = $state<number | undefined>(undefined);
</script>

{#each Array.from({ length: 11 }, (_, i) => i) as score}
  <NetPromoterScorePickerButton
    value={score}
    label={String(score)}
    selected={nps === score}
    onclick={() => (nps = score)}
  />
{/each}
```

### Composed inside NetPromoterScorePicker

```svelte
<script lang="ts">
  import NetPromoterScorePicker from '../NetPromoterScorePicker/NetPromoterScorePicker.svelte';
  import NetPromoterScorePickerButton from './NetPromoterScorePickerButton.svelte';

  let nps = $state<number | undefined>(undefined);
</script>

<NetPromoterScorePicker label="How likely are you to recommend us?">
  {#each Array.from({ length: 11 }, (_, i) => i) as score}
    <NetPromoterScorePickerButton
      value={score}
      label={String(score)}
      selected={nps === score}
      onclick={() => (nps = score)}
    />
  {/each}
</NetPromoterScorePicker>
```

### Disabled button

```svelte
<NetPromoterScorePickerButton value={0} label="0" disabled />
```

### CSS targeting by score

Consumers can style Detractors, Passives, and Promoters via the `data-value` attribute:

```css
.net-promoter-score-picker-button[data-value="0"],
.net-promoter-score-picker-button[data-value="6"] { /* detractor */ }
.net-promoter-score-picker-button[data-value="9"],
.net-promoter-score-picker-button[data-value="10"] { /* promoter */ }
```

## Accessibility

- `aria-label` provides the accessible name.
- `aria-pressed` reflects selected state (toggle button pattern).
- `disabled` is propagated to assistive technology natively.
- Keyboard: Tab to focus, Enter or Space to activate (native button behavior).
- WCAG 2.2 AAA: accessible name, visible focus via consumer CSS, pressed state communicated.

## Related components

- `NetPromoterScorePicker` — parent container for NPS buttons.
- `NetPromoterScoreView` — read-only display counterpart.
- `FiveStarRatingPickerButton`, `FiveFaceRatingPickerButton` — sibling rating picker buttons.
- `RedAmberGreenPickerButton`, `RedOrangeYellowGreenBluePickerButton` — status picker buttons with the same compound pattern.

---

Lily™ and Lily Design System™ are trademarks.
