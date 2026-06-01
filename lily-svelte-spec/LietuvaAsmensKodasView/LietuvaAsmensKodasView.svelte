<script lang="ts">
    // LietuvaAsmensKodasView component
    //
    // A headless display component for showing Lithuania's
    // Asmens kodas in a read-only format.
    // Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <LietuvaAsmensKodasView label="Personal Code" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Lithuania

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

<!-- LietuvaAsmensKodasView.svelte -->
<span
    class={`lietuva-asmens-kodas-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
