<script lang="ts">
    // FiveFaceRatingView component
    //
    // A read-only five-face rating display that shows a text label corresponding to a
    // rating value from 1 to 5. This is the display-only companion to FiveFaceRatingPicker,
    // used for showing previously submitted ratings in summaries, review lists, or
    // dashboard displays. Renders a span with role="img" and the face label text.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, required. Rating value (1-5) to display.
    //   label — string, required. Accessible description via aria-label.
    //   labels — string[], default ["Very bad", "Bad", "Okay", "Good", "Very good"]. Text labels for each face.
    //   ...restProps — additional HTML attributes spread onto the span.
    //
    // Syntax:
    //   <FiveFaceRatingView value={4} label="Good rating" />
    //
    // Examples:
    //   <!-- Display a submitted face rating -->
    //   <FiveFaceRatingView value={3} label="Okay rating" />
    //
    //   <!-- Custom face labels -->
    //   <FiveFaceRatingView value={5} label="Excellent" labels={["Terrible", "Poor", "Fair", "Great", "Excellent"]} />
    //
    // Keyboard:
    //   - None — this is a passive, read-only display element
    //
    // Accessibility:
    //   - role="img" indicates the span represents a visual/graphic element (the face rating)
    //   - aria-label provides the full rating description for screen readers
    //   - data-value attribute exposes the numeric value for consumer CSS or testing
    //
    // Internationalization:
    //   - All text content comes through the labels and label props; no hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $derived() to look up the face label from the labels array based on value
    //   - Companion to FiveFaceRatingPicker for the Input/View pattern
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/WAI/ARIA/apd/roles/img/

    let {
        class: className = "",
        value,
        label,
        labels = ["Very bad", "Bad", "Okay", "Good", "Very good"],
        ...restProps
    }: {
        /** Rating value (1-5). */
        value: number;
        /** Accessible description. */
        label: string;
        /** Labels for each face. */
        labels?: string[];
        [key: string]: unknown;
    } = $props();

    let faceLabel = $derived(labels[value - 1] ?? "");
</script>

<!-- FiveFaceRatingView.svelte -->
<span
    class={`five-face-rating-view ${className}`}
    role="img"
    aria-label={label}
    data-value={value}
    {...restProps}
>
    {faceLabel}
</span>
