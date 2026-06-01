# FiveStarRatingPickerButton

A headless button representing a single star in a five-star rating picker. Renders a `<button>` element with `aria-pressed` to communicate the selected state and a `data-value` attribute for consumer CSS targeting.

## What it is

A Svelte 5 compound component that renders one `<button type="button">` with `aria-label`, `aria-pressed`, and `data-value`. It is intended for consumers who want to build their own rating picker using per-star buttons rather than the radio-group approach of `FiveStarRatingPicker`.

## What it does

- Renders a `<button type="button">` with the base class `five-star-rating-picker-button`.
- Writes `aria-label={label}` so screen readers announce the star's rating level.
- Sets `aria-pressed` to the `selected` prop so assistive tech conveys the toggle state.
- Exposes `data-value={value}` so consumers can style or target individual stars with CSS selectors.
- Renders the `label` text as visible button content.
- Forwards a click handler via the `onclick` prop.
- Spreads extra HTML attributes onto the button.

## When to use it

- Building a custom star-rating picker where each star needs to be individually focusable or animatable.
- Compositions needing per-star `aria-pressed` state rather than a single radiogroup.
- Tests that need `data-value` selectors to target a specific star.

## When not to use it

- As a complete rating control on its own. Use `FiveStarRatingPicker` for the full radiogroup pattern.
- For a read-only display. Use `FiveStarRatingView`.
- For generic toggle behaviour. Use `ToggleButton`.

## How to use it

Compose five instances (values 1-5) inside a container. Track the selected value in consumer state, set `selected` per button by comparing with the current rating, and update state from each `onclick`.

## Props

- `class` (string, optional) - CSS class appended after the base `five-star-rating-picker-button` class.
- `value` (number, required) - The rating value this button represents (1-5).
- `label` (string, required) - Accessible name and visible button text (e.g. "1 star", "3 stars").
- `selected` (boolean, default `false`) - Whether this star is currently the selected rating.
- `disabled` (boolean, default `false`) - Disables the button.
- `onclick` ((event: MouseEvent) => void, optional) - Click handler.
- `...restProps` - Additional attributes spread onto the `<button>`.

## Usage

```svelte
<script lang="ts">
    import FiveStarRatingPickerButton from "./FiveStarRatingPickerButton.svelte";
    let rating = $state(0);
    const stars = [
        { value: 1, label: "1 star" },
        { value: 2, label: "2 stars" },
        { value: 3, label: "3 stars" },
        { value: 4, label: "4 stars" },
        { value: 5, label: "5 stars" },
    ];
</script>

<div role="group" aria-label="Rate this">
    {#each stars as s}
        <FiveStarRatingPickerButton
            value={s.value}
            label={s.label}
            selected={rating === s.value}
            onclick={() => (rating = s.value)}
        />
    {/each}
</div>
```

```svelte
<script lang="ts">
    import FiveStarRatingPickerButton from "./FiveStarRatingPickerButton.svelte";
</script>

<FiveStarRatingPickerButton value={4} label="4 stars" selected />
```

```svelte
<script lang="ts">
    import FiveStarRatingPickerButton from "./FiveStarRatingPickerButton.svelte";
</script>

<FiveStarRatingPickerButton value={1} label="1 star" disabled />
```

```svelte
<script lang="ts">
    import FiveStarRatingPickerButton from "./FiveStarRatingPickerButton.svelte";
    let hovered = $state<number | null>(null);
</script>

<FiveStarRatingPickerButton
    value={3}
    label="3 stars"
    onclick={() => console.log("clicked 3")}
    onmouseenter={() => (hovered = 3)}
    onmouseleave={() => (hovered = null)}
/>
```

```svelte
<script lang="ts">
    import FiveStarRatingPickerButton from "./FiveStarRatingPickerButton.svelte";
    let rating = $state(2);
</script>

<FiveStarRatingPickerButton
    value={2}
    label="2 stars"
    selected={rating === 2}
    class="custom-star"
    data-testid="star-2"
    onclick={() => (rating = 2)}
/>
```

## Accessibility

- `aria-label` provides the accessible name (e.g. "3 stars").
- `aria-pressed` conveys the selected/unselected toggle state.
- Native `<button>` supports Enter and Space activation.
- `disabled` attribute disables focus and activation via native browser behaviour.
- `data-value` is a styling hook only and has no accessibility semantics.

## Related components

- `FiveStarRatingPicker` - the compound parent picker using radio buttons.
- `FiveStarRatingView` - read-only star-rating display.
- `ToggleButton` - generic toggle button with `aria-pressed`.
- `FiveFaceRatingPickerButton` - single-button version for face ratings.
