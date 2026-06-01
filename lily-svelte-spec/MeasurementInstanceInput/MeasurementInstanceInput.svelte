<script lang="ts">
    // MeasurementInstanceInput component
    //
    // A headless text input for entering a specific measurement instance value,
    // such as "72 kg", "98.6 F", or "120/80 mmHg". A measurement instance is an
    // individual recorded measurement combining a numeric value with its unit.
    // The component renders an <input type="text"> with aria-label for accessible
    // naming and a bindable value for reactive form integration.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the input via aria-label.
    //   value — string, default "". Bindable measurement instance value via $bindable().
    //   required — boolean, default false. Whether the field is required.
    //   disabled — boolean, default false. Whether the field is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <MeasurementInstanceInput label="Weight" bind:value />
    //
    // Examples:
    //   <!-- Basic measurement input -->
    //   <MeasurementInstanceInput label="Weight" bind:value />
    //
    //   <!-- Required temperature input -->
    //   <MeasurementInstanceInput label="Temperature" bind:value required />
    //
    // Keyboard:
    //   - Native <input type="text"> keyboard behavior (typing, selection, clipboard-copy-button).
    //
    // Accessibility:
    //   - aria-label provides the accessible name from the label prop
    //   - Supports required and disabled HTML states
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Part of the Input/View pattern; pairs with MeasurementInstanceView
    //
    // References:
    //   - HTML input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible name for the measurement instance input */
        label: string;
        /** Bindable measurement instance value */
        value?: string;
        /** Whether the input is required */
        required?: boolean;
        /** Whether the input is disabled */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- MeasurementInstanceInput.svelte -->
<input
    class={`measurement-instance-input ${className}`}
    type="text"
    aria-label={label}
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
