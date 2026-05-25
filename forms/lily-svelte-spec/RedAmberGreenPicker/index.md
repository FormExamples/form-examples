# RedAmberGreenPicker

A headless Red/Amber/Green (RAG) status picker that renders a native `<select>` with three traffic-light options: red, amber, and green.

## What it is

- Component: `RedAmberGreenPicker`
- HTML element: `<select>` containing three fixed `<option>`s
- Role: native select (combobox / listbox)
- Category: form input (picker half of the Picker / PickerButton pair for RAG)

## What it does

- Renders a `<select aria-label="…">` with three hardcoded options: `red`, `amber`, `green`.
- Supports `bind:value` for two-way binding of the selected status string.
- Provides native dropdown keyboard behavior (Up/Down, Enter/Space, Escape).

## When to use it

- Project health dashboards, risk registers, and RAG-style status reporting.
- Any form where one of three traffic-light levels must be captured.

## When not to use it

- For a five-level status scale — use `RedOrangeYellowGreenBluePicker`.
- For a satisfaction score — use `FiveFaceRatingPicker` or `NetPromoterScorePicker`.
- For a star rating — use `FiveStarRatingPicker`.
- For custom-styled buttons instead of a dropdown — compose `RedAmberGreenPickerButton`s in your own container.
- To display an already-captured RAG value — use `RedAmberGreenView`.

## How to use it

Import and bind a string value (`"red" | "amber" | "green" | ""`).

```svelte
import RedAmberGreenPicker from './RedAmberGreenPicker.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `red-amber-green-picker`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: string, default `""`. Bindable with `bind:value`.
- `...restProps`: spread onto the `<select>`.

## Usage

### Pre-selected value

```svelte
<script lang="ts">
  import RedAmberGreenPicker from './RedAmberGreenPicker.svelte';
</script>

<RedAmberGreenPicker label="Health check" value="green" />
```

### Two-way binding

```svelte
<script lang="ts">
  import RedAmberGreenPicker from './RedAmberGreenPicker.svelte';

  let status = $state("amber");
</script>

<RedAmberGreenPicker label="Sprint status" bind:value={status} />
<p>Current: {status}</p>
```

### Compound picker using buttons (composition pattern)

```svelte
<script lang="ts">
  import RedAmberGreenPickerButton from '../RedAmberGreenPickerButton/RedAmberGreenPickerButton.svelte';

  let status = $state("green");
  const levels = ["red", "amber", "green"] as const;
</script>

<div role="group" aria-label="Project status">
  {#each levels as level}
    <RedAmberGreenPickerButton
      value={level}
      label={level}
      selected={status === level}
      onclick={() => (status = level)}
    />
  {/each}
</div>
```

### Alongside the view counterpart

```svelte
<script lang="ts">
  import RedAmberGreenPicker from './RedAmberGreenPicker.svelte';
  import RedAmberGreenView from '../RedAmberGreenView/RedAmberGreenView.svelte';

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

### With a test hook

```svelte
<RedAmberGreenPicker label="Risk" bind:value={status} data-testid="rag" />
```

## Accessibility

- `aria-label` on the `<select>` provides the accessible name.
- Native `<select>` provides implicit combobox/listbox semantics and keyboard navigation.
- Option text ("Red", "Amber", "Green") is hardcoded in English; wrap or fork to localize.
- WCAG 2.2 AAA: color alone is insufficient — pair the picker's output with readable text like `RedAmberGreenView`.

## Related components

- `RedAmberGreenView` — read-only display sibling for a captured RAG value.
- `RedAmberGreenPickerButton` — button-style picker used when you want a custom button-based picker UI.
- `RedOrangeYellowGreenBluePicker`, `RedOrangeYellowGreenBluePickerButton`, `RedOrangeYellowGreenBlueView` — five-level scale.
- Other pickers: `FiveFaceRatingPicker`, `FiveStarRatingPicker`, `NetPromoterScorePicker`.
