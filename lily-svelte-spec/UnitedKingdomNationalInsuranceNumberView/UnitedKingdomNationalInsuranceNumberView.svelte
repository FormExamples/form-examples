<script lang="ts">
    // UnitedKingdomNationalInsuranceNumberView component
    //
    // A headless display component for showing United Kingdom's
    // National Insurance Number (NINO) in a read-only format.
    // Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <UnitedKingdomNationalInsuranceNumberView label="National Insurance Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Insurance_number

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- UnitedKingdomNationalInsuranceNumberView.svelte -->
<span
    class={`united-kingdom-national-insurance-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
