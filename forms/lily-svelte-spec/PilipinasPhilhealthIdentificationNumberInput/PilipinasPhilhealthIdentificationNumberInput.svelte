<script lang="ts">
    // PilipinasPhilhealthIdentificationNumberInput component
    //
    // A headless input for entering the Philippines's PhilHealth Identification Number (PIN).
    // Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.
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
    //   <PilipinasPhilhealthIdentificationNumberInput label="PhilHealth Identification Number (PIN)" bind:value />
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
    //   - https://en.wikipedia.org/wiki/PhilHealth

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
            "PilipinasPhilhealthIdentificationNumberInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- PilipinasPhilhealthIdentificationNumberInput.svelte -->
<input
    class={`pilipinas-philhealth-identification-number-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
