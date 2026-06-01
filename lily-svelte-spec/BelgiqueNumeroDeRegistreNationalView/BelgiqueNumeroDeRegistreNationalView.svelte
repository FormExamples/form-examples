<script lang="ts">
    // BelgiqueNumeroDeRegistreNationalView component
    //
    // A headless display component for showing Belgium's
    // Numéro de Registre National / Rijksregisternummer (NRN) in a read-only format.
    // Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <BelgiqueNumeroDeRegistreNationalView label="National Register Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Belgium

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

<!-- BelgiqueNumeroDeRegistreNationalView.svelte -->
<span
    class={`belgique-numero-de-registre-national-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
