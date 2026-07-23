# FiveFaceRatingPickerButton

A single face button representing one value (1–5) in a five-face rating picker. Renders `<button aria-pressed data-value>` with an accessible label.

## What it is

`FiveFaceRatingPickerButton` is the per-value primitive used to compose a custom five-face picker. Each button represents one rating level and toggles its `aria-pressed` attribute to indicate whether it is the currently selected face. Consumer components typically render five of these inside a custom picker container.

## What it does

- Renders `<button type="button" aria-label={label} aria-pressed={selected} data-value={value}>{label}</button>`.
- Forwards `onclick` so the parent can update selection.
- Applies `disabled` to the button.
- Spreads `restProps` onto the `<button>`.

## When to use it

- Building a custom picker UI instead of using `FiveFaceRatingPicker`'s native radios.
- Scenarios where buttons (toggle-like) are preferred over radio-button semantics.
- Fine-grained control over layout, animation, and visual treatment of each face.

## When not to use it

- For a ready-made radio-based picker. Use `FiveFaceRatingPicker` instead.
- For displaying a submitted rating. Use `FiveFaceRatingView`.
- For any different scale (3-level, 10-level, stars). Use the corresponding picker family.

## How to use it

Render one button per value (1–5) and track selection in the parent.

```svelte
<script lang="ts">
    import FiveFaceRatingPickerButton from "./FiveFaceRatingPickerButton.svelte";
    let rating = $state(0);
    const labels = ["Very bad", "Bad", "Okay", "Good", "Very good"];
</script>

<div role="group" aria-label="Rate us">
    {#each labels as l, i}
        <FiveFaceRatingPickerButton
            value={i + 1}
            label={l}
            selected={rating === i + 1}
            onclick={() => rating = i + 1}
        />
    {/each}
</div>
```

## Props

| Prop       | Type                              | Default     | Description                                |
| ---------- | --------------------------------- | ----------- | ------------------------------------------ |
| `class`    | `string`                          | `""`        | CSS class appended to the base class.     |
| `value`    | `number`                          | required    | Rating value (1–5).                        |
| `label`    | `string`                          | required    | Accessible name and visible button text.   |
| `selected` | `boolean`                         | `false`     | Whether this face is currently selected.   |
| `disabled` | `boolean`                         | `false`     | Whether the button is disabled.            |
| `onclick`  | `(event: MouseEvent) => void`     | `undefined` | Click handler.                             |
| `...rest`  | `unknown`                         | —           | Additional HTML attributes on the button.  |

## Usage

### 1. Composition with FiveFaceRatingPicker

```svelte
<script lang="ts">
    import FiveFaceRatingPickerButton from "./FiveFaceRatingPickerButton.svelte";
    let rating = $state(0);
    const labels = ["Very bad", "Bad", "Okay", "Good", "Very good"];
</script>

<div role="group" aria-label="Experience">
    {#each labels as label, i}
        <FiveFaceRatingPickerButton
            value={i + 1}
            {label}
            selected={rating === i + 1}
            onclick={() => rating = i + 1}
        />
    {/each}
</div>
```

### 2. Selected state

```svelte
<FiveFaceRatingPickerButton value={4} label="Good" selected />
```

### 3. Disabled

```svelte
<FiveFaceRatingPickerButton value={1} label="Very bad" disabled />
```

### 4. Styled via data-value

```svelte
<FiveFaceRatingPickerButton value={3} label="Okay" />
<!-- CSS may target [data-value="3"] for a specific face colour -->
```

### 5. Localised

```svelte
<FiveFaceRatingPickerButton value={5} label="Excelente" onclick={pickFive} />
```

## Accessibility

- `aria-label` provides the face description.
- `aria-pressed` communicates the current selection state.
- `data-value` is a styling/testing hook only, not exposed to assistive technology.

## Related components

- `FiveFaceRatingPicker` — complete radio-based picker using these semantics.
- `FiveFaceRatingView` — read-only face rating display.
- `FiveStarRatingPickerButton`, `NetPromoterScorePickerButton`, `RedAmberGreenPickerButton`, `RedOrangeYellowGreenBluePickerButton`, `ThemeSelectButton`, `ColorPickerButton` — analogous per-option picker buttons.

---

Lily™ and Lily Design System™ are trademarks.
