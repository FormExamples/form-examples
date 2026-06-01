# NetPromoterScoreView

A headless read-only display of a Net Promoter Score value. Renders a `<span>` with an accessible label so screen readers announce both the context and the displayed score.

## What it is

- Component: `NetPromoterScoreView`
- HTML element: `<span>`
- Role: inline text; accessible name via `aria-label`
- Category: view (read-only display half of the Input/View pattern for NPS)

## What it does

- Displays an NPS score value as inline text content.
- Announces context to assistive technology through `aria-label`.
- Spreads additional attributes onto the `<span>` for hooks such as `data-testid` or color-coding.
- Performs no validation, formatting, or classification — consumers supply the value.

## When to use it

- Dashboards, reports, summary cards that show a previously captured NPS score.
- Detail views where the score is informational rather than editable.
- Alongside other read-only person or customer data (e.g. inside a `SummaryList`).

## When not to use it

- To capture an NPS score: use `NetPromoterScorePicker` with `NetPromoterScorePickerButton`.
- To show star or face ratings: use `FiveStarRatingView` or `FiveFaceRatingView`.
- To show status levels (RAG, ROYGB): use `RedAmberGreenView` or `RedOrangeYellowGreenBlueView`.

## How to use it

Import and render with a required `label`. The `value` is displayed as-is.

```svelte
import NetPromoterScoreView from './NetPromoterScoreView.svelte';
```

## Props

- `class` (`className`): string, default `""`. Extra CSS class appended to `net-promoter-score-view`.
- `label`: string, required. Accessible label announced by screen readers via `aria-label`.
- `value`: string, default `""`. The NPS score to display.
- `...restProps`: any other HTML attributes are spread onto the `<span>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import NetPromoterScoreView from './NetPromoterScoreView.svelte';
</script>

<NetPromoterScoreView label="NPS Score" value="8" />
```

### Dynamic value

```svelte
<script lang="ts">
  import NetPromoterScoreView from './NetPromoterScoreView.svelte';

  let score = $state("9");
</script>

<NetPromoterScoreView label="Customer rating" value={score} />
```

### Paired with the input counterpart

```svelte
<script lang="ts">
  import NetPromoterScorePicker from '../NetPromoterScorePicker/NetPromoterScorePicker.svelte';
  import NetPromoterScorePickerButton from '../NetPromoterScorePickerButton/NetPromoterScorePickerButton.svelte';
  import NetPromoterScoreView from './NetPromoterScoreView.svelte';

  let nps = $state<number | undefined>(undefined);
  let submitted = $state(false);
</script>

{#if submitted}
  <NetPromoterScoreView label="Your score" value={String(nps ?? "")} />
{:else}
  <NetPromoterScorePicker label="Rate us">
    {#each Array.from({ length: 11 }, (_, i) => i) as score}
      <NetPromoterScorePickerButton
        value={score}
        label={String(score)}
        selected={nps === score}
        onclick={() => (nps = score)}
      />
    {/each}
  </NetPromoterScorePicker>
{/if}
```

### Color-coded via data attribute

```svelte
<NetPromoterScoreView label="NPS" value="3" data-band="detractor" />
```

## Accessibility

- `aria-label` provides the accessible name announced alongside the displayed value.
- No interactive behavior; the component is not focusable and exposes no keyboard affordances.
- WCAG 2.2 AAA: consumer-supplied CSS must maintain color contrast if using color coding by score.

## Related components

- `NetPromoterScorePicker`, `NetPromoterScorePickerButton` — capture an NPS score.
- `FiveStarRatingView`, `FiveFaceRatingView` — sibling rating view components.
- `RedAmberGreenView`, `RedOrangeYellowGreenBlueView` — sibling read-only status displays.
