<script lang="ts">
    // RedAmberGreenView component
    //
    // A headless RAG (Red/Amber/Green) status view that displays a traffic-light
    // status value as read-only text inside a <span> element. Used to present
    // previously captured RAG status data in dashboards, reports, and detail views
    // where the status is informational rather than editable.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The RAG status value to display (e.g. "red", "amber", "green").
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <RedAmberGreenView label="Project status" value="green" />
    //
    // Examples:
    //   <!-- Display a dynamic status -->
    //   <RedAmberGreenView label="Health check" value={status} />
    //
    //   <!-- With extra attributes -->
    //   <RedAmberGreenView label="Risk level" value="amber" data-testid="risk" />
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
        /** The RAG status value to display (e.g. "red", "amber", "green") */
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- RedAmberGreenView.svelte -->
<span
    class={`red-amber-green-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
