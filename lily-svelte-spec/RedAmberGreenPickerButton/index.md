# RedAmberGreenPickerButton

A headless button representing one Red/Amber/Green (RAG) status choice. Renders a `<button>` with `aria-pressed` indicating selection and `data-value` for consumer CSS hooks.

## What it is

- Component: `RedAmberGreenPickerButton`
- HTML element: `<button type="button">`
- Role: toggle button (`aria-pressed` reflects selection)
- Category: form input (button-style companion to `RedAmberGreenPicker`)

## What it does

- Renders a `<button>` with `type="button"` so it does not submit a form by accident.
- Applies `aria-label`, `aria-pressed` (from `selected`), and `data-value` (from `value`).
- Renders the `label` as the visible button text.
- Optionally forwards an `onclick` handler.
- Forwards any other HTML attributes onto the `<button>`.

## When to use it

- When you want a horizontal or tile-style RAG picker with custom styling rather than a native `<select>` dropdown.
- Inside a `role="group"` or similar container to compose a custom picker.
- Anywhere in a RAG dashboard where clicking a colored button picks the RAG level.

## When not to use it

- For a native dropdown selector — use `RedAmberGreenPicker`.
- For a five-level scale — use `RedOrangeYellowGreenBluePickerButton`.
- For rating / satisfaction scales — use `FiveStarRatingPickerButton`, `FiveFaceRatingPickerButton`, `NetPromoterScorePickerButton`.
- To display an already-captured value — use `RedAmberGreenView`.

## How to use it

Compose three buttons — one per status — inside your own container. Manage the `selected` state externally.

```svelte
import RedAmberGreenPickerButton from './RedAmberGreenPickerButton.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `red-amber-green-picker-button`.
- `value`: string, required. Status value (e.g. `"red"`, `"amber"`, `"green"`).
- `label`: string, required. Accessible name and visible text.
- `selected`: boolean, default `false`. Whether this status is currently selected.
- `disabled`: boolean, default `false`.
- `onclick`: `(event: MouseEvent) => void`, optional.
- `...restProps`: spread onto the `<button>`.

## Usage

### Single selected button

```svelte
<script lang="ts">
  import RedAmberGreenPickerButton from './RedAmberGreenPickerButton.svelte';
</script>

<RedAmberGreenPickerButton value="red" label="Red" selected={true} />
```

### Full composed picker (composition with RedAmberGreenPicker pattern)

```svelte
<script lang="ts">
  import RedAmberGreenPickerButton from './RedAmberGreenPickerButton.svelte';

  let status = $state("green");
  const levels = [
    { value: "red", label: "Red" },
    { value: "amber", label: "Amber" },
    { value: "green", label: "Green" },
  ];
</script>

<div role="group" aria-label="Project status">
  {#each levels as lv}
    <RedAmberGreenPickerButton
      value={lv.value}
      label={lv.label}
      selected={status === lv.value}
      onclick={() => (status = lv.value)}
    />
  {/each}
</div>
<p>Selected: {status}</p>
```

### Disabled button

```svelte
<script lang="ts">
  import RedAmberGreenPickerButton from './RedAmberGreenPickerButton.svelte';
</script>

<RedAmberGreenPickerButton value="amber" label="Amber" disabled={true} />
```

### CSS targeting via data-value

```svelte
<script lang="ts">
  import RedAmberGreenPickerButton from './RedAmberGreenPickerButton.svelte';
</script>

<!-- Consumer CSS can target [data-value="red"], [data-value="amber"], [data-value="green"] -->
<RedAmberGreenPickerButton value="red" label="Red" />
<RedAmberGreenPickerButton value="amber" label="Amber" />
<RedAmberGreenPickerButton value="green" label="Green" />
```

### Localized labels

```svelte
<script lang="ts">
  import RedAmberGreenPickerButton from './RedAmberGreenPickerButton.svelte';

  let status = $state("");
</script>

<RedAmberGreenPickerButton
  value="red"
  label="Rojo"
  selected={status === "red"}
  onclick={() => (status = "red")}
/>
```

## Accessibility

- `aria-label` names the button for screen readers.
- `aria-pressed` indicates the selected/unselected state — preferred for toggle semantics over simple click handlers.
- `type="button"` prevents accidental form submission.
- Keyboard: Tab to focus, Enter or Space to activate.
- WCAG 2.2 AAA: do not rely on color alone — ensure the label is always rendered and that a visible focus indicator is supplied via consumer CSS.

## Related components

- `RedAmberGreenPicker` — native `<select>` variant of this picker.
- `RedAmberGreenView` — read-only display sibling.
- `RedOrangeYellowGreenBluePickerButton` — five-level button equivalent.
- Other picker buttons: `FiveStarRatingPickerButton`, `FiveFaceRatingPickerButton`, `NetPromoterScorePickerButton`.
