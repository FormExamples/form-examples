# FiveFaceRatingView

A read-only display of a 1–5 face rating. Renders a `<span role="img">` whose text content is the label corresponding to the value.

## What it is

`FiveFaceRatingView` is the display-only companion to `FiveFaceRatingPicker`. Given a numeric `value` (1–5) it derives the matching face label from the `labels` array and renders it inside a `<span role="img">` with an `aria-label` for accessibility. The `data-value` attribute exposes the numeric value for consumer CSS.

## What it does

- Renders `<span class="five-face-rating-view" role="img" aria-label={label} data-value={value}>`.
- Derives `faceLabel` via `$derived(labels[value - 1] ?? "")`.
- Shows the derived label as text content.
- Forwards `restProps`.

## When to use it

- Dashboards and summaries where a previously submitted rating should appear.
- Review lists, profile pages, report screens.
- Anywhere a face label should be announced as an image with a meaningful `aria-label`.

## When not to use it

- For capturing a new rating. Use `FiveFaceRatingPicker`.
- For star ratings. Use `FiveStarRatingView`.
- For Net Promoter Score values. Use `NetPromoterScoreView`.
- For free-form text display. Use a plain `<span>`.

## How to use it

Provide the numeric value and a label describing the rating.

```svelte
<script lang="ts">
    import FiveFaceRatingView from "./FiveFaceRatingView.svelte";
</script>

<FiveFaceRatingView value={4} label="Good rating" />
```

## Props

| Prop      | Type       | Default                                                | Description                                  |
| --------- | ---------- | ------------------------------------------------------ | -------------------------------------------- |
| `class`   | `string`   | `""`                                                   | CSS class appended to the base class.       |
| `value`   | `number`   | required                                               | Rating value (1–5).                          |
| `label`   | `string`   | required                                               | Accessible name via `aria-label`.            |
| `labels`  | `string[]` | `["Very bad", "Bad", "Okay", "Good", "Very good"]`     | Text labels for each face.                   |
| `...rest` | `unknown`  | —                                                      | Additional HTML attributes on the `<span>`.  |

## Usage

### 1. Basic display

```svelte
<FiveFaceRatingView value={3} label="Okay rating" />
```

### 2. Custom labels

```svelte
<FiveFaceRatingView
    value={5}
    label="Excellent"
    labels={["Terrible", "Poor", "Fair", "Great", "Excellent"]}
/>
```

### 3. Localised (French)

```svelte
<FiveFaceRatingView
    value={4}
    label="Bonne note"
    labels={["Très mauvais", "Mauvais", "Correct", "Bon", "Très bon"]}
/>
```

### 4. Paired with the picker

```svelte
<FiveFaceRatingPicker label="Rate" bind:value={rating} />
{#if rating > 0}
    <FiveFaceRatingView value={rating} label="Your rating" />
{/if}
```

### 5. In a summary list

```svelte
<SummaryList>
    <SummaryListItem term="Satisfaction">
        <FiveFaceRatingView value={survey.rating} label="Satisfaction rating" />
    </SummaryListItem>
</SummaryList>
```

## Accessibility

- `role="img"` with `aria-label` treats the span as a labelled image, so screen readers announce the descriptive label rather than the plain text.
- `data-value` is a styling hook only; it is not exposed to assistive technology.

## Related components

- `FiveFaceRatingPicker` — picker counterpart (radio-based).
- `FiveFaceRatingPickerButton` — individual face button primitive.
- `FiveStarRatingView`, `NetPromoterScoreView`, `RedAmberGreenView`, `RedOrangeYellowGreenBlueView` — analogous read-only rating views.

---

Lily™ and Lily Design System™ are trademarks.
