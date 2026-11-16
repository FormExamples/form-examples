<script lang="ts">
    // DeutschlandKrankenversichertennummerInput component
    //
    // A headless input for entering Germany's Krankenversichertennummer (KVNR).
    // Format: a random capital letter followed by eight random digits and a Luhn check digit.
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
    //   <DeutschlandKrankenversichertennummerInput label="Health Insurance Number" bind:value />
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
    //   - https://de.wikipedia.org/wiki/Krankenversichertennummer

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
            "DeutschlandKrankenversichertennummerInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- DeutschlandKrankenversichertennummerInput.svelte -->
<input
    class={`deutschland-krankenversichertennummer-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
