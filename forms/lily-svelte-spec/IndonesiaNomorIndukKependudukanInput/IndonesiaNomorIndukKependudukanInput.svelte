<script lang="ts">
    // IndonesiaNomorIndukKependudukanInput component
    //
    // A headless input for entering Indonesia's Nomor Induk Kependudukan (NIK).
    // Format: Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.
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
    //   <IndonesiaNomorIndukKependudukanInput label="Nomor Induk Kependudukan (NIK)" bind:value />
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
    //   - https://en.wikipedia.org/wiki/National_identification_number#Indonesia

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
            "IndonesiaNomorIndukKependudukanInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- IndonesiaNomorIndukKependudukanInput.svelte -->
<input
    class={`indonesia-nomor-induk-kependudukan-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
