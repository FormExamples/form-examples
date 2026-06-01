<script lang="ts">
    // CyprusNationalPassportNumberView component
    //
    // A headless display component for showing Cyprus's
    // National Passport Number in a read-only format.
    // Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <CyprusNationalPassportNumberView label="National Passport Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Cypriot_passport

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

<!-- CyprusNationalPassportNumberView.svelte -->
<span
    class={`cyprus-national-passport-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
