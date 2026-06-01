<script lang="ts">
    // MeasurementUnitView component
    //
    // A headless display component that shows a measurement unit in a <span>
    // element. A measurement unit is a standard quantity used to express a
    // physical measurement, such as "kg", "lb", "cm", or "inch". This is a
    // read-only display component, part of the Input/View pattern for measurement
    // data.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, required. The measurement unit to display.
    //   label — string, optional. Accessible name via aria-label for additional context.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MeasurementUnitView value="kg" />
    //
    // Examples:
    //   <!-- Simple unit abbreviation display -->
    //   <MeasurementUnitView value="kg" />
    //
    //   <!-- With accessible label for abbreviated unit -->
    //   <MeasurementUnitView value="lb" label="Pounds" />
    //
    // Keyboard:
    //   - None — this is a display-only component with no interactive behavior.
    //
    // Accessibility:
    //   - aria-label optionally provides additional context beyond the displayed unit
    //   - Text content is inherently accessible to screen readers
    //
    // Internationalization:
    //   - All text comes through the value and label props
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Part of the Input/View pattern; pairs with MeasurementUnitInput
    //
    // References:
    //   - HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

    let {
        class: className = "",
        value,
        label = undefined,
        ...restProps
    }: {
        /** The measurement unit to display */
        value: string;
        /** Optional accessible name */
        label?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- MeasurementUnitView.svelte -->
<span
    class={`measurement-unit-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
