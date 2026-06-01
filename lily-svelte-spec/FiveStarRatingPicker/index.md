# FiveStarRatingPicker

A headless five-star rating input that lets users select a rating from 1 to 5 stars using native radio buttons grouped in a fieldset. It is one of the most common rating patterns on the web, used for product reviews, content ratings, and feedback forms.

## What it is

A Svelte 5 component that renders a `<fieldset>` with `role="radiogroup"` containing five `<label>` / `<input type="radio">` pairs. Each radio button is labelled "1 star", "2 stars", "3 stars", "4 stars", "5 stars" for clear screen reader communication.

## What it does

- Renders a fieldset with `role="radiogroup"` and the consumer-supplied `aria-label`.
- Emits five radio inputs sharing a `name` attribute for native form submission.
- Uses `$bindable()` on `value` so the selected rating (1-5, or 0 for none) stays in sync via `bind:value`.
- Checks the input whose `value` matches the current rating and updates `value` on the `onchange` event.
- Supports a group-level `disabled` flag that disables the entire fieldset.

## When to use it

- Product or service reviews.
- Content rating widgets (articles, videos, recipes).
- Feedback forms where a 1-5 satisfaction scale is appropriate.
- Any context where users should select exactly one rating from a discrete 1-5 scale.

## When not to use it

- For a read-only presentation of an existing rating. Use `FiveStarRatingView` instead.
- When the rating scale is not 1-5 (e.g. Net Promoter Score 0-10). Use `NetPromoterScorePicker`.
- When face icons convey the scale better than stars. Use `FiveFaceRatingPicker`.
- For a single-button "pick one star at a time" control. Use `FiveStarRatingPickerButton`.
- When the rating is non-discrete and needs an analog slider. Use `RangeInput`.

## How to use it

Import the component, bind a number-typed state variable to `value`, and pass a required `label` describing the rating group. The consumer supplies all CSS.

## Props

- `class` (string, optional) - CSS class appended after the base `five-star-rating-picker` class.
- `label` (string, required) - Accessible name applied to the fieldset via `aria-label`.
- `value` (number, default `0`) - Current rating (1-5, `0` = none). Bindable via `bind:value`.
- `name` (string, default `"rating"`) - Radio group `name` attribute used for form submission.
- `disabled` (boolean, default `false`) - Disables the entire fieldset.
- `...restProps` - Additional attributes spread onto the `<fieldset>` element.

## Usage

```svelte
<script lang="ts">
    import FiveStarRatingPicker from "./FiveStarRatingPicker.svelte";
    let rating = $state(0);
</script>

<FiveStarRatingPicker label="Rate this product" bind:value={rating} />
<p>You selected: {rating}</p>
```

```svelte
<script lang="ts">
    import FiveStarRatingPicker from "./FiveStarRatingPicker.svelte";
    let rating = $state(4);
</script>

<FiveStarRatingPicker
    label="Your rating"
    bind:value={rating}
    disabled
/>
```

```svelte
<script lang="ts">
    import FiveStarRatingPicker from "./FiveStarRatingPicker.svelte";
    import Form from "../Form/Form.svelte";
    import Button from "../Button/Button.svelte";

    let rating = $state(0);
    function handleSubmit() { console.log("submitted", rating); }
</script>

<Form label="Feedback" onsubmit={handleSubmit}>
    <FiveStarRatingPicker
        label="Overall satisfaction"
        name="satisfaction"
        bind:value={rating}
    />
    <Button type="submit" label="Submit">Submit</Button>
</Form>
```

```svelte
<script lang="ts">
    import FiveStarRatingPicker from "./FiveStarRatingPicker.svelte";
    let r1 = $state(0);
    let r2 = $state(0);
</script>

<FiveStarRatingPicker label="Taste" name="taste" bind:value={r1} />
<FiveStarRatingPicker label="Value" name="value" bind:value={r2} />
```

```svelte
<script lang="ts">
    import FiveStarRatingPicker from "./FiveStarRatingPicker.svelte";
    let rating = $state(3);
</script>

<FiveStarRatingPicker
    label="Rating"
    bind:value={rating}
    class="my-custom-stars"
    data-testid="product-rating"
/>
```

## Accessibility

- `role="radiogroup"` on the fieldset identifies the set of radios as a single group.
- `aria-label` gives the group an accessible name.
- Each label reads "1 star", "2 stars", ... for screen readers.
- Native radio keyboard behaviour: Tab focuses the selected radio (or first if none), Arrow keys move between radios, Space selects the focused radio.
- `disabled` on the fieldset disables every child radio.

## Related components

- `FiveStarRatingPickerButton` - single button representing one star, for custom picker compositions.
- `FiveStarRatingView` - read-only display of a star rating.
- `FiveFaceRatingPicker` - satisfaction rating using face icons.
- `NetPromoterScorePicker` - 0-10 Net Promoter Score picker.
- `RadioGroup` - generic radio group.
