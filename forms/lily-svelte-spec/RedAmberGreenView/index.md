# RedAmberGreenView

A headless read-only display of a Red/Amber/Green (RAG) status. Renders the value inside a `<span>` with an accessible label so screen readers announce both the context and the displayed status.

## What it is

- Component: `RedAmberGreenView`
- HTML element: `<span>`
- Role: inline text; accessible name via `aria-label`
- Category: view (read-only display sibling of `RedAmberGreenPicker`)

## What it does

- Displays a RAG status string as inline text.
- Announces context to assistive technology via `aria-label`.
- Spreads additional HTML attributes onto the `<span>` (e.g. `data-testid` or color-coding hooks).
- Performs no validation or formatting — the consumer supplies the status value.

## When to use it

- Dashboards, reports, and summary cards that display a previously captured RAG status.
- Inline surfacing of project or risk health in read-only contexts.
- Alongside other read-only status information (e.g. inside a `SummaryList`).

## When not to use it

- To capture a RAG value — use `RedAmberGreenPicker` or compose `RedAmberGreenPickerButton`s.
- For a five-level scale — use `RedOrangeYellowGreenBlueView`.
- For rating or satisfaction displays — use `FiveStarRatingView`, `FiveFaceRatingView`, `NetPromoterScoreView`.

## How to use it

Import and render with a required `label`. The `value` is displayed as-is.

```svelte
import RedAmberGreenView from './RedAmberGreenView.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `red-amber-green-view`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: string, default `""`. The RAG status to display (e.g. `"red"`, `"amber"`, `"green"`).
- `...restProps`: spread onto the `<span>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import RedAmberGreenView from './RedAmberGreenView.svelte';
</script>

<RedAmberGreenView label="Project status" value="green" />
```

### Dynamic value

```svelte
<script lang="ts">
  import RedAmberGreenView from './RedAmberGreenView.svelte';

  let status = $state("amber");
</script>

<RedAmberGreenView label="Health check" value={status} />
```

### Paired with the picker counterpart

```svelte
<script lang="ts">
  import RedAmberGreenPicker from '../RedAmberGreenPicker/RedAmberGreenPicker.svelte';
  import RedAmberGreenView from './RedAmberGreenView.svelte';

  let status = $state("");
  let submitted = $state(false);
</script>

{#if submitted}
  <RedAmberGreenView label="Status" value={status} />
{:else}
  <RedAmberGreenPicker label="Status" bind:value={status} />
  <button type="button" onclick={() => (submitted = true)}>Confirm</button>
{/if}
```

### Color-coded via data attribute

```svelte
<RedAmberGreenView label="Risk level" value="amber" data-tone="warning" />
```

### Localized value

```svelte
<RedAmberGreenView label="Estado" value="rojo" />
```

## Accessibility

- `aria-label` provides the accessible name for the inline `<span>`.
- No interactive behavior; the component is not focusable.
- WCAG 2.2 AAA: color alone is insufficient — always render a text value so status is communicated independently of hue.

## Related components

- `RedAmberGreenPicker` — dropdown-style picker sibling.
- `RedAmberGreenPickerButton` — button-style picker sibling.
- `RedOrangeYellowGreenBlueView` — five-level status view.
- Other read-only status views: `FiveStarRatingView`, `FiveFaceRatingView`, `NetPromoterScoreView`.

---

Lily™ and Lily Design System™ are trademarks.
