<script lang="ts">
    // EireIndividualHealthIdentifierInput component
    //
    // A headless input for entering an Eire Individual Health Identifier (IHI),
    // a 10-digit clinical identifier used by the HSE to safely match patients
    // with their medical records across different hospitals and GPs.
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
    //   <EireIndividualHealthIdentifierInput label="IHI" bind:value />
    //
    // Examples:
    //   <!-- Required IHI input -->
    //   <EireIndividualHealthIdentifierInput label="IHI" required />
    //
    //   <!-- Disabled IHI input -->
    //   <EireIndividualHealthIdentifierInput label="IHI" disabled />
    //
    // Keyboard:
    //   - Standard text input keyboard behavior
    //
    // Accessibility:
    //   - aria-label provides the accessible name for screen readers
    //   - inputmode="numeric" hints mobile devices to show numeric keyboard
    //   - pattern="[0-9]{10}" validates 10-digit format
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
    //   - HSE: https://www.hse.ie/

    import { warnMissingName } from "../dev-warning";

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

    $effect(() =>
        warnMissingName(
            "EireIndividualHealthIdentifierInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    const ihiPattern = "[0-9]{10}";
</script>

<!-- EireIndividualHealthIdentifierInput.svelte -->
<input
    class={`eire-individual-health-identifier-input ${className}`}
    type="text"
    aria-label={label}
    inputmode="numeric"
    pattern={ihiPattern}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
