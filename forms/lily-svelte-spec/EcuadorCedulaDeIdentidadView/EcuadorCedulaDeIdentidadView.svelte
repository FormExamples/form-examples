<script lang="ts">
    // EcuadorCedulaDeIdentidadView component
    //
    // A headless display component for showing Ecuador's
    // Cedula de Identidad Number in a read-only format.
    // Format: Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit below 6 for a natural person, six more digits, and a check digit. The first nine digits are multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and the check digit brings the sum to the next multiple of 10.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <EcuadorCedulaDeIdentidadView label="Cedula de Identidad Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad

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

<!-- EcuadorCedulaDeIdentidadView.svelte -->
<span
    class={`ecuador-cedula-de-identidad-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
