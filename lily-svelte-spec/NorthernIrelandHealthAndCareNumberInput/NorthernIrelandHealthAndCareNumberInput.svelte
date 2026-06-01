<script lang="ts">
    // NorthernIrelandHealthAndCareNumberInput component
    //
    // A headless input for entering a Northern Ireland Health and Care (H&C)
    // Number, a 10-digit identifier displayed as XXX XXX XXXX, used by HSC
    // Northern Ireland to uniquely identify patients.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". Bindable input value; supports bind:value.
    //   required — boolean, default false. Whether the input is required for form submission.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <NorthernIrelandHealthAndCareNumberInput label="H&C Number" bind:value />
    //
    // Examples:
    //   <!-- Required H&C Number input -->
    //   <NorthernIrelandHealthAndCareNumberInput label="H&C Number" required />
    //
    //   <!-- Disabled H&C Number input -->
    //   <NorthernIrelandHealthAndCareNumberInput label="H&C Number" disabled />
    //
    // Keyboard:
    //   - Standard text input keyboard behavior
    //
    // Accessibility:
    //   - aria-label provides the accessible name for screen readers
    //   - inputmode="numeric" hints mobile devices to show numeric keyboard
    //   - pattern="[0-9]{3} [0-9]{3} [0-9]{4}" validates 3-3-4 digit format
    //   - autocomplete="off" protects sensitive health identifiers
    //   - required and disabled states are conveyed to assistive technology
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable() for two-way data binding on value
    //   - Pattern constant avoids Svelte curly brace parsing
    //
    // References:
    //   - HSC NI: https://online.hscni.net/

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label for screen readers */
        label: string;
        /** The current value of the input, bindable */
        value?: string;
        /** Whether the input is required for form submission */
        required?: boolean;
        /** Whether the input is disabled */
        disabled?: boolean;
        /** Additional HTML attributes */
        [key: string]: unknown;
    } = $props();

    const hcPattern = "[0-9]{3} [0-9]{3} [0-9]{4}";
</script>

<!-- NorthernIrelandHealthAndCareNumberInput.svelte -->
<input
    class={`northern-ireland-health-and-care-number-input ${className}`}
    type="text"
    aria-label={label}
    inputmode="numeric"
    pattern={hcPattern}
    autocomplete="off"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
