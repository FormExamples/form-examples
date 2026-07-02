<script lang="ts">
    // FiveStarRatingPickerButton component
    //
    // A headless button representing one star in a five-star rating picker. Renders
    // a <button> with aria-pressed to indicate the selected state and data-value for
    // consumer CSS targeting. Each button represents a rating level (1-5) with a
    // descriptive label (e.g. "1 star", "3 stars"). Commonly used in product reviews,
    // content ratings, and feedback forms.
    //
    // Props:
    //   value — number, required. The rating value (1-5).
    //   label — string, required. Accessible name for the button (e.g. "1 star", "3 stars").
    //   selected — boolean, default false. Whether this star is currently selected.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   onclick — (event: MouseEvent) => void, optional. Click handler.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <FiveStarRatingPickerButton value={3} label="3 stars" onclick={handleSelect} />
    //
    // Examples:
    //   <!-- Selected star button -->
    //   <FiveStarRatingPickerButton value={4} label="4 stars" selected={true} onclick={handleSelect} />
    //   <!-- Disabled star button -->
    //   <FiveStarRatingPickerButton value={1} label="1 star" disabled={true} />
    //
    // Keyboard:
    //   - Tab: Move focus to the button
    //   - Enter: Activate the button (native button behavior)
    //   - Space: Activate the button (native button behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name describing the star level
    //   - aria-pressed indicates whether the star is currently selected
    //   - data-value exposes the rating value for consumer CSS selectors
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: used as a child within FiveStarRatingPicker
    //   - Consumer can use [data-value] CSS selectors for value-based styling
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    let {
        class: className = "",
        value,
        label,
        selected = false,
        disabled = false,
        onclick = undefined,
        ...restProps
    }: {
        /** The rating value (1-5). */
        value: number;
        /** Accessible name for the button (e.g. "1 star", "3 stars"). */
        label: string;
        /** Whether this star is currently selected. */
        selected?: boolean;
        /** Whether the button is disabled. */
        disabled?: boolean;
        /** Click handler. */
        onclick?: (event: MouseEvent) => void;
        [key: string]: unknown;
    } = $props();
</script>

<!-- FiveStarRatingPickerButton.svelte -->
<button
    class={`five-star-rating-picker-button ${className}`}
    type="button"
    aria-label={label}
    aria-pressed={selected}
    {disabled}
    data-value={value}
    {onclick}
    {...restProps}
>{label}</button>
