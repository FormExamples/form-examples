<script lang="ts">
    // RedOrangeYellowGreenBlueView component
    //
    // A headless ROYGB (Red/Orange/Yellow/Green/Blue) status view that displays
    // a five-level color-coded status value as read-only text inside a <span>.
    // Used to present previously captured ROYGB status data in dashboards, reports,
    // or detail views where the five-level scale offers more granularity than RAG.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The ROYGB status to display (e.g. "red", "orange", "yellow", "green", "blue").
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <RedOrangeYellowGreenBlueView label="Risk level" value="yellow" />
    //
    // Examples:
    //   <!-- Display a dynamic status -->
    //   <RedOrangeYellowGreenBlueView label="Alert status" value={level} />
    //
    //   <!-- With extra attributes for testing -->
    //   <RedOrangeYellowGreenBlueView label="System health" value="blue" data-testid="health" />
    //
    // Keyboard:
    //   - None — this is a passive informational display, not an interactive element.
    //
    // Accessibility:
    //   - aria-label on the <span> for screen reader context
    //   - Screen readers announce the label and displayed status value
    //   - WCAG 2.2 AAA: properly labeled for assistive technology
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //   - The value is displayed as-is, allowing localized status names
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Read-only display component — not interactive, no $bindable()
    //   - Consumer can apply color-coded backgrounds or text colors via restProps
    //
    // References:
    //   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
    //   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        /** Accessible label for screen readers */
        label: string;
        /** The ROYGB status value to display */
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- RedOrangeYellowGreenBlueView: displays a ROYGB status value as text -->
<span
    class={`red-orange-yellow-green-blue-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
