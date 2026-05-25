# RedOrangeYellowGreenBluePicker

A headless five-level Red/Orange/Yellow/Green/Blue (ROYGB) status picker that renders a native `<select>` with five color-coded options. Extends the classic RAG model with two extra levels for more granular reporting.

## What it is

- Component: `RedOrangeYellowGreenBluePicker`
- HTML element: `<select>` with five fixed `<option>`s
- Role: native select (combobox / listbox)
- Category: form input (picker half of the Picker / PickerButton pair)

## What it does

- Renders a `<select aria-label="…">` with five hardcoded options: `red`, `orange`, `yellow`, `green`, `blue`.
- Supports `bind:value` for two-way binding.
- Provides native dropdown keyboard behavior.

## When to use it

- Multi-tier alert systems, risk registers, and dashboards needing more granularity than RAG.
- Any setting where the five-level palette is the correct domain model.

## When not to use it

- For three-level status — use `RedAmberGreenPicker`.
- For custom-styled buttons — compose `RedOrangeYellowGreenBluePickerButton`s in your own container.
- To display an already-captured value — use `RedOrangeYellowGreenBlueView`.
- For numeric rating scales — use `FiveStarRatingPicker`, `FiveFaceRatingPicker`, or `NetPromoterScorePicker`.

## How to use it

Import and bind a string value.

```svelte
import RedOrangeYellowGreenBluePicker from './RedOrangeYellowGreenBluePicker.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `red-orange-yellow-green-blue-picker`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: string, default `""`. Bindable with `bind:value`.
- `...restProps`: spread onto the `<select>`.

## Usage

### Pre-selected value

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePicker from './RedOrangeYellowGreenBluePicker.svelte';
</script>

<RedOrangeYellowGreenBluePicker label="Alert status" value="green" />
```

### Two-way binding

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePicker from './RedOrangeYellowGreenBluePicker.svelte';

  let level = $state("yellow");
</script>

<RedOrangeYellowGreenBluePicker label="Project health" bind:value={level} />
<p>Level: {level}</p>
```

### Compound picker using buttons (composition pattern)

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePickerButton from '../RedOrangeYellowGreenBluePickerButton/RedOrangeYellowGreenBluePickerButton.svelte';

  let level = $state("green");
  const levels = ["red", "orange", "yellow", "green", "blue"] as const;
</script>

<div role="group" aria-label="Alert level">
  {#each levels as lv}
    <RedOrangeYellowGreenBluePickerButton
      value={lv}
      label={lv}
      selected={level === lv}
      onclick={() => (level = lv)}
    />
  {/each}
</div>
```

### Alongside the view counterpart

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePicker from './RedOrangeYellowGreenBluePicker.svelte';
  import RedOrangeYellowGreenBlueView from '../RedOrangeYellowGreenBlueView/RedOrangeYellowGreenBlueView.svelte';

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
<RedOrangeYellowGreenBluePicker label="Level" bind:value={level} data-dashboard="main" />
```

## Accessibility

- `aria-label` on the `<select>` provides the accessible name.
- Native `<select>` provides implicit combobox/listbox semantics and keyboard navigation.
- Option text ("Red", "Orange", "Yellow", "Green", "Blue") is hardcoded in English; wrap or fork to localize.
- WCAG 2.2 AAA: color alone is insufficient — always surface the text value somewhere (for example via `RedOrangeYellowGreenBlueView`).

## Related components

- `RedOrangeYellowGreenBlueView` — read-only display sibling.
- `RedOrangeYellowGreenBluePickerButton` — button-style picker sibling.
- `RedAmberGreenPicker`, `RedAmberGreenPickerButton`, `RedAmberGreenView` — three-level scale.
- Other pickers: `FiveFaceRatingPicker`, `FiveStarRatingPicker`, `NetPromoterScorePicker`.
