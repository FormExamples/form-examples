<script lang="ts">
    // PakistanComputerizedNationalIdentityCardInput component
    //
    // A headless input for entering Pakistan's Computerized National Identity Card Number (CNIC).
    // Format: Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.
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
    //   <PakistanComputerizedNationalIdentityCardInput label="Computerized National Identity Card Number (CNIC)" bind:value />
    //
    // Accessibility:
    //   - aria-label provides the accessible name for screen readers
    //   - autocomplete="off" protects sensitive identifiers
    //   - required and disabled states are conveyed to assistive technology
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Computerized_National_Identity_Card

    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "PakistanComputerizedNationalIdentityCardInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- PakistanComputerizedNationalIdentityCardInput.svelte -->
<input
    class={`pakistan-computerized-national-identity-card-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
