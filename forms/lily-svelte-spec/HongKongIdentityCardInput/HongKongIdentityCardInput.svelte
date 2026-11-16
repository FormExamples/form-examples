<script lang="ts">
    // HongKongIdentityCardInput component
    //
    // A headless input for entering Hong Kong's Identity Card Number.
    // Format: One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when the result is 10).
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
    //   <HongKongIdentityCardInput label="Hong Kong Identity Card Number" bind:value />
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
    //   - https://en.wikipedia.org/wiki/Hong_Kong_identity_card

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
            "HongKongIdentityCardInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- HongKongIdentityCardInput.svelte -->
<input
    class={`hong-kong-identity-card-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
