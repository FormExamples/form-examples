<script lang="ts">
    // MexicoClaveUnicaDeRegistroDePoblacionView component
    //
    // A headless display component for showing Mexico's
    // Clave Única de Registro de Población (CURP) in a read-only format.
    // Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MexicoClaveUnicaDeRegistroDePoblacionView label="Clave Única de Registro de Población (CURP)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_Population_Registry_Code

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

<!-- MexicoClaveUnicaDeRegistroDePoblacionView.svelte -->
<span
    class={`mexico-clave-unica-de-registro-de-poblacion-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
