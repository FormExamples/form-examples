<script lang="ts">
    // AsSaudiyahRaqmAlHuwiyahAlWataniyahInput component
    //
    // A headless input for entering Saudi Arabia's National Identification Number.
    // Format: Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.
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
    //   <AsSaudiyahRaqmAlHuwiyahAlWataniyahInput label="National Identification Number" bind:value />
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
    //   - https://en.wikipedia.org/wiki/National_identity_card

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
            "AsSaudiyahRaqmAlHuwiyahAlWataniyahInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- AsSaudiyahRaqmAlHuwiyahAlWataniyahInput.svelte -->
<input
    class={`as-saudiyah-raqm-al-huwiyah-al-wataniyah-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
