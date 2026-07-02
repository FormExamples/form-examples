# RedOrangeYellowGreenBlueView

A headless read-only display of a five-level Red/Orange/Yellow/Green/Blue (ROYGB) status. Renders the value inside a `<span>` with an accessible label so screen readers announce both the context and the displayed status.

## What it is

- Component: `RedOrangeYellowGreenBlueView`
- HTML element: `<span>`
- Role: inline text; accessible name via `aria-label`
- Category: view (read-only display sibling of `RedOrangeYellowGreenBluePicker`)

## What it does

- Displays a ROYGB status string as inline text.
- Announces context to assistive technology via `aria-label`.
- Spreads additional attributes onto the `<span>`.
- Performs no validation or formatting — the consumer supplies the status value.

## When to use it

- Dashboards, reports, and detail views that display a previously captured ROYGB status.
- Inline surfacing of multi-tier alert or risk level in read-only contexts.
- Alongside other read-only status information inside a `SummaryList`.

## When not to use it

- To capture a ROYGB value — use `RedOrangeYellowGreenBluePicker` or compose `RedOrangeYellowGreenBluePickerButton`s.
- For three-level status — use `RedAmberGreenView`.
- For rating / satisfaction displays — use `FiveStarRatingView`, `FiveFaceRatingView`, `NetPromoterScoreView`.

## How to use it

Import and render with a required `label`. The `value` is displayed as-is.

```svelte
import RedOrangeYellowGreenBlueView from './RedOrangeYellowGreenBlueView.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `red-orange-yellow-green-blue-view`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: string, default `""`. The ROYGB status (e.g. `"red"`, `"orange"`, `"yellow"`, `"green"`, `"blue"`).
- `...restProps`: spread onto the `<span>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBlueView from './RedOrangeYellowGreenBlueView.svelte';
</script>

<RedOrangeYellowGreenBlueView label="Risk level" value="yellow" />
```

### Dynamic value

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBlueView from './RedOrangeYellowGreenBlueView.svelte';

  let level = $state("blue");
</script>

<RedOrangeYellowGreenBlueView label="Alert status" value={level} />
```

### Paired with the picker counterpart

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePicker from '../RedOrangeYellowGreenBluePicker/RedOrangeYellowGreenBluePicker.svelte';
  import RedOrangeYellowGreenBlueView from './RedOrangeYellowGreenBlueView.svelte';

  let level = $state("");
  let submitted = $state(false);
</script>

{#if submitted}
  <RedOrangeYellowGreenBlueView label="Level" value={level} />
{:else}
  <RedOrangeYellowGreenBluePicker label="Level" bind:value={level} />
  <button type="button" onclick={() => (submitted = true)}>Confirm</button>
{/if}
```

### With a data attribute

```svelte
<RedOrangeYellowGreenBlueView label="System health" value="blue" data-testid="health" />
```

### Localized value

```svelte
<RedOrangeYellowGreenBlueView label="Nivel" value="rojo" />
```

## Accessibility

- `aria-label` provides the accessible name for the inline `<span>`.
- Not focusable; no keyboard handling.
- WCAG 2.2 AAA: color alone is insufficient — always render a text value so status is communicated independently of hue.

## Related components

- `RedOrangeYellowGreenBluePicker` — dropdown-style picker sibling.
- `RedOrangeYellowGreenBluePickerButton` — button-style picker sibling.
- `RedAmberGreenView` — three-level status view.
- Other read-only status views: `FiveStarRatingView`, `FiveFaceRatingView`, `NetPromoterScoreView`.
