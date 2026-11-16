<script lang="ts">
    // ColombiaCedulaDeCiudadaniaView component
    //
    // A headless display component for showing Colombia's
    // Cedula de Ciudadania Number in a read-only format.
    // Format: Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <ColombiaCedulaDeCiudadaniaView label="Cedula de Ciudadania Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Colombian_identity_card

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label?: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ColombiaCedulaDeCiudadaniaView.svelte -->
<span
    class={`colombia-cedula-de-ciudadania-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
