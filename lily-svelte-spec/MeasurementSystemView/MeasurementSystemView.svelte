<script lang="ts">
    // MeasurementSystemView component
    //
    // A headless display component that shows a measurement system name in a
    // <span> element. A measurement system is a collection of units and rules for
    // measuring physical quantities, such as "metric", "imperial", or "SI". This
    // is a read-only display component, part of the Input/View pattern for
    // measurement data.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, required. The measurement system name to display.
    //   label — string, optional. Accessible name via aria-label for additional context.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MeasurementSystemView value="metric" />
    //
    // Examples:
    //   <!-- Simple system name display -->
    //   <MeasurementSystemView value="metric" />
    //
    //   <!-- With accessible label for abbreviated system name -->
    //   <MeasurementSystemView value="SI" label="International System of Units" />
    //
    // Keyboard:
    //   - None — this is a display-only component with no interactive behavior.
    //
    // Accessibility:
    //   - aria-label optionally provides additional context beyond the displayed name
    //   - Text content is inherently accessible to screen readers
    //
    // Internationalization:
    //   - All text comes through the value and label props
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Part of the Input/View pattern; pairs with MeasurementSystemInput
    //
    // References:
    //   - HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

    let {
        class: className = "",
        value,
        label = undefined,
        ...restProps
    }: {
        /** The measurement system name to display */
        value: string;
        /** Optional accessible name */
        label?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- MeasurementSystemView.svelte -->
<span
    class={`measurement-system-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
