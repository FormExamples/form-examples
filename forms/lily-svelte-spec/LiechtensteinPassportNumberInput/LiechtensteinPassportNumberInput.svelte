<script lang="ts">
    // LiechtensteinPassportNumberInput component
    //
    // A headless input for entering Liechtenstein's Liechtenstein Passport Number.
    // Format: 1 letter followed by 5 digits (e.g. R00536).
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
    //   <LiechtensteinPassportNumberInput label="Liechtenstein Passport Number" bind:value />
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
    //   - https://en.wikipedia.org/wiki/Liechtenstein_passport

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
</script>

<!-- LiechtensteinPassportNumberInput.svelte -->
<input
    class={`liechtenstein-passport-number-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
