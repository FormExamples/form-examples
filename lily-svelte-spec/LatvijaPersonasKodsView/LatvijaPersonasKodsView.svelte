<script lang="ts">
    // LatvijaPersonasKodsView component
    //
    // A headless display component for showing Latvia's
    // Personas kods in a read-only format.
    // Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <LatvijaPersonasKodsView label="Personal Code" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Latvia

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

<!-- LatvijaPersonasKodsView.svelte -->
<span
    class={`latvija-personas-kods-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
