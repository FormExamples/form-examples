<script lang="ts">
    // FiveStarRatingView component
    //
    // A read-only five-star rating display that renders filled and empty star characters
    // to visually represent a rating value from 0 to 5. This is the display-only companion
    // to FiveStarRatingPicker, used for showing ratings in product listings, review summaries,
    // and user profiles. Screen readers receive the full rating via aria-label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Rating value (0-5) to display.
    //   label — string, required. Accessible description via aria-label (e.g., "4 out of 5 stars").
    //   ...restProps — additional HTML attributes spread onto the outer span.
    //
    // Syntax:
    //   <FiveStarRatingView value={4} label="4 out of 5 stars" />
    //
    // Examples:
    //   <!-- Display a product rating -->
    //   <FiveStarRatingView value={4} label="4 out of 5 stars" />
    //
    //   <!-- Display an empty rating -->
    //   <FiveStarRatingView value={0} label="No rating" />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" on the outer span indicates it represents a visual/graphic element
    //   - aria-label provides the full rating description for screen readers
    //   - aria-hidden="true" on inner star spans prevents reading individual characters
    //   - data-value and data-filled attributes enable consumer CSS styling
    //
    // Internationalization:
    //   - The label prop allows localized rating descriptions
    //   - Star characters are decorative; meaningful text is conveyed via aria-label
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses Unicode star characters for filled/empty display
    //   - Companion to FiveStarRatingPicker for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        ...restProps
    }: {
        /** Rating value (0-5). */
        value: number;
        /** Accessible description. */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- FiveStarRatingView.svelte -->
<span
    class={`five-star-rating-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>
    {#each [1, 2, 3, 4, 5] as star}
        <span
            aria-hidden="true"
            data-filled={value >= star}>{value >= star ? "★" : "☆"}</span
        >
    {/each}
</span>
