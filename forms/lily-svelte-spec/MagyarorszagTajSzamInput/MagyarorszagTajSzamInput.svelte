<script lang="ts">
    // MagyarorszagTajSzamInput component
    //
    // A headless input for entering Hungary's Társadalombiztosítási Azonosító Jel (TAJ).
    // Format: Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an algorithm unique to Hungary, distinct from Luhn.
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
    //   <MagyarorszagTajSzamInput label="Társadalombiztosítási Azonosító Jel (TAJ)" bind:value />
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
    //   - https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel

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
            "MagyarorszagTajSzamInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- MagyarorszagTajSzamInput.svelte -->
<input
    class={`magyarorszag-taj-szam-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
