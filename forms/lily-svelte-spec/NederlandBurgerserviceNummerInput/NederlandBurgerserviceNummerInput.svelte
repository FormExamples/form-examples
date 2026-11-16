<script lang="ts">
    // NederlandBurgerserviceNummerInput component
    //
    // A headless input for entering Netherlands's Burgerservicenummer (BSN).
    // Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.
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
    //   <NederlandBurgerserviceNummerInput label="Citizen Service Number" bind:value />
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
    //   - https://en.wikipedia.org/wiki/Burgerservicenummer

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
            "NederlandBurgerserviceNummerInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- NederlandBurgerserviceNummerInput.svelte -->
<input
    class={`nederland-burgerservice-nummer-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
