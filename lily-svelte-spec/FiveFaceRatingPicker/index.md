# FiveFaceRatingPicker

A radio group for selecting a satisfaction rating from 1 to 5 using face labels ("Very bad" to "Very good").

## What it is

`FiveFaceRatingPicker` renders a `<fieldset role="radiogroup">` with five labelled `<input type="radio">` elements. The default face labels are `["Very bad", "Bad", "Okay", "Good", "Very good"]`, but the full array is overridable for localisation or custom wording. Value `0` means no selection; valid ratings are `1`–`5`.

## What it does

- Renders `<fieldset role="radiogroup" aria-label={label}>` containing five labelled radios.
- Binds `value` (1–5, or 0 for none) via `$bindable()`.
- Uses native radio buttons for keyboard arrow navigation, Tab, and Space.
- Forwards `disabled` to disable the whole group.
- Exposes `name` for form submission.

## When to use it

- Satisfaction surveys, feedback widgets, end-of-interaction rating prompts.
- Anywhere face-based wording is more intuitive than numeric stars.
- Forms where the rating must be submitted as a radio-group value.

## When not to use it

- For star-based ratings. Use `FiveStarRatingPicker`.
- For Net Promoter Score (0–10). Use `NetPromoterScorePicker`.
- For read-only display. Use `FiveFaceRatingView`.
- For three-level red/amber/green. Use `RedAmberGreenPicker`.

## How to use it

Bind `value` and provide a `label`.

```svelte
<script lang="ts">
    import FiveFaceRatingPicker from "./FiveFaceRatingPicker.svelte";
    let rating = $state(0);
</script>

<FiveFaceRatingPicker label="How was your experience?" bind:value={rating} />
```

## Props

| Prop       | Type       | Default                                                      | Description                                  |
| ---------- | ---------- | ------------------------------------------------------------ | -------------------------------------------- |
| `class`    | `string`   | `""`                                                         | CSS class appended to the base class.       |
| `label`    | `string`   | required                                                     | Accessible name via `aria-label`.            |
| `value`    | `number`   | `0`                                                          | Current rating (1–5). Bindable. 0 = none.    |
| `name`     | `string`   | `"face-rating"`                                              | Radio group `name`.                          |
| `labels`   | `string[]` | `["Very bad", "Bad", "Okay", "Good", "Very good"]`           | Label for each face.                         |
| `disabled` | `boolean`  | `false`                                                      | Whether the group is disabled.               |
| `...rest`  | `unknown`  | —                                                            | Additional HTML attributes on the fieldset.  |

## Usage

### 1. Basic binding

```svelte
<FiveFaceRatingPicker label="How was your experience?" bind:value={rating} />
```

### 2. Custom labels

```svelte
<FiveFaceRatingPicker
    label="Rate the service"
    bind:value={rating}
    labels={["Terrible", "Poor", "Fair", "Great", "Excellent"]}
/>
```

### 3. Localised (Spanish)

```svelte
<FiveFaceRatingPicker
    label="¿Cómo fue su experiencia?"
    bind:value={rating}
    labels={["Muy mala", "Mala", "Regular", "Buena", "Muy buena"]}
/>
```

### 4. With a custom name for forms

```svelte
<form method="post">
    <FiveFaceRatingPicker label="Rating" name="satisfaction" bind:value={rating} />
    <button type="submit">Submit</button>
</form>
```

### 5. Paired view after selection

```svelte
<FiveFaceRatingPicker label="Rate this" bind:value={rating} />
{#if rating > 0}
    <p>You selected: <FiveFaceRatingView value={rating} label="Your rating" /></p>
{/if}
```

## Accessibility

- `role="radiogroup"` + `aria-label` group the radios.
- Native radios provide Tab, Arrow, and Space handling.
- Disabling the fieldset disables every descendant radio.

## Related components

- `FiveFaceRatingView` — read-only face rating display.
- `FiveFaceRatingPickerButton` — individual face button primitive.
- `FiveStarRatingPicker`, `FiveStarRatingView` — star-based rating alternatives.
- `NetPromoterScorePicker`, `NetPromoterScoreView` — 0–10 NPS alternative.
- `RedAmberGreenPicker`, `RedOrangeYellowGreenBluePicker` — colour-based alternatives.
