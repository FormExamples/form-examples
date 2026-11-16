<script lang="ts">
    // TaiwanGuominShenfenzhengTongyiBianhaoInput component
    //
    // A headless input for entering Taiwan's National Identification Card Number.
    // Format: One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.
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
    //   <TaiwanGuominShenfenzhengTongyiBianhaoInput label="National Identification Card Number" bind:value />
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
    //   - https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)

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
            "TaiwanGuominShenfenzhengTongyiBianhaoInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- TaiwanGuominShenfenzhengTongyiBianhaoInput.svelte -->
<input
    class={`taiwan-guomin-shenfenzheng-tongyi-bianhao-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
