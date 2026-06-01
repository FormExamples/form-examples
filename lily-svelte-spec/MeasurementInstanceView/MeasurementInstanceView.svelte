<script lang="ts">
    // MeasurementInstanceView component
    //
    // A headless display component that shows a specific measurement instance
    // value in a <span> element. A measurement instance is a concrete data point
    // such as "72 kg", "98.6 F", or "120/80 mmHg". This is a read-only display
    // component, part of the Input/View pattern for measurement data.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, required. The measurement instance value to display.
    //   label — string, optional. Accessible name via aria-label for additional context.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MeasurementInstanceView value="72 kg" />
    //
    // Examples:
    //   <!-- Simple measurement display -->
    //   <MeasurementInstanceView value="72 kg" />
    //
    //   <!-- With accessible label for screen reader context -->
    //   <MeasurementInstanceView value="98.6 F" label="Body temperature" />
    //
    // Keyboard:
    //   - None — this is a display-only component with no interactive behavior.
    //
    // Accessibility:
    //   - aria-label optionally provides additional context beyond the displayed value
    //   - Text content is inherently accessible to screen readers
    //
    // Internationalization:
    //   - All text comes through the value and label props
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Part of the Input/View pattern; pairs with MeasurementInstanceInput
    //
    // References:
    //   - HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

    let {
        class: className = "",
        value,
        label = undefined,
        ...restProps
    }: {
        /** The measurement instance value to display */
        value: string;
        /** Optional accessible name */
        label?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- MeasurementInstanceView.svelte -->
<span
    class={`measurement-instance-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
