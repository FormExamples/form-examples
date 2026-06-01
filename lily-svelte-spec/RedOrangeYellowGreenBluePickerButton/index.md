# RedOrangeYellowGreenBluePickerButton

A headless button representing one Red/Orange/Yellow/Green/Blue (ROYGB) status choice. Renders a `<button>` with `aria-pressed` indicating selection and `data-value` for consumer CSS hooks.

## What it is

- Component: `RedOrangeYellowGreenBluePickerButton`
- HTML element: `<button type="button">`
- Role: toggle button (`aria-pressed` reflects selection)
- Category: form input (button-style companion to `RedOrangeYellowGreenBluePicker`)

## What it does

- Renders a `<button>` with `type="button"` so it does not submit forms.
- Applies `aria-label`, `aria-pressed` (from `selected`), and `data-value` (from `value`).
- Renders the `label` as the visible button text.
- Optionally forwards an `onclick` handler.
- Forwards any other HTML attributes onto the `<button>`.

## When to use it

- When you want a tile-style or horizontal five-level picker with custom styling rather than a native `<select>`.
- Inside a `role="group"` container to compose a custom picker.
- In dashboards where each level should be a discretely clickable, visually prominent button.

## When not to use it

- For a native dropdown — use `RedOrangeYellowGreenBluePicker`.
- For three levels — use `RedAmberGreenPickerButton`.
- For numeric rating scales — use `FiveStarRatingPickerButton`, `FiveFaceRatingPickerButton`, `NetPromoterScorePickerButton`.
- To display an already-captured value — use `RedOrangeYellowGreenBlueView`.

## How to use it

Compose five buttons — one per level — inside your own container. Manage `selected` state externally.

```svelte
import RedOrangeYellowGreenBluePickerButton from './RedOrangeYellowGreenBluePickerButton.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `red-orange-yellow-green-blue-picker-button`.
- `value`: string, required. Level value (e.g. `"red"`, `"orange"`, `"yellow"`, `"green"`, `"blue"`).
- `label`: string, required. Accessible name and visible text.
- `selected`: boolean, default `false`.
- `disabled`: boolean, default `false`.
- `onclick`: `(event: MouseEvent) => void`, optional.
- `...restProps`: spread onto the `<button>`.

## Usage

### Single selected button

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePickerButton from './RedOrangeYellowGreenBluePickerButton.svelte';
</script>

<RedOrangeYellowGreenBluePickerButton value="red" label="Red" selected />
```

### Full composed picker (composition pattern)

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePickerButton from './RedOrangeYellowGreenBluePickerButton.svelte';

  let level = $state("green");
  const levels = [
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "yellow", label: "Yellow" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
  ];
</script>

<div role="group" aria-label="Alert level">
  {#each levels as lv}
    <RedOrangeYellowGreenBluePickerButton
      value={lv.value}
      label={lv.label}
      selected={level === lv.value}
      onclick={() => (level = lv.value)}
    />
  {/each}
</div>
<p>Selected: {level}</p>
```

### Disabled button

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePickerButton from './RedOrangeYellowGreenBluePickerButton.svelte';
</script>

<RedOrangeYellowGreenBluePickerButton value="yellow" label="Yellow" disabled />
```

### CSS targeting via data-value

```svelte
<!-- consumer CSS can target [data-value="red"], [data-value="orange"], etc. -->
<RedOrangeYellowGreenBluePickerButton value="red" label="Red" />
<RedOrangeYellowGreenBluePickerButton value="blue" label="Blue" />
```

### Localized labels

```svelte
<script lang="ts">
  import RedOrangeYellowGreenBluePickerButton from './RedOrangeYellowGreenBluePickerButton.svelte';

  let level = $state("");
</script>

<RedOrangeYellowGreenBluePickerButton
  value="red"
  label="Rojo"
  selected={level === "red"}
  onclick={() => (level = "red")}
/>
```

## Accessibility

- `aria-label` names the button for screen readers.
- `aria-pressed` indicates the selected state — preferred toggle semantics.
- `type="button"` avoids accidental form submission.
- Keyboard: Tab to focus, Enter or Space to activate.
- WCAG 2.2 AAA: never rely on color alone — always render the `label`.

## Related components

- `RedOrangeYellowGreenBluePicker` — native `<select>` variant.
- `RedOrangeYellowGreenBlueView` — read-only display sibling.
- `RedAmberGreenPickerButton` — three-level button equivalent.
- Other picker buttons: `FiveStarRatingPickerButton`, `FiveFaceRatingPickerButton`, `NetPromoterScorePickerButton`.
