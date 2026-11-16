<script lang="ts">
    // PortugalNumeroDeIdentificacaoFiscalView component
    //
    // A headless display component for showing Portugal's
    // Número de Identificação Fiscal (NIF) in a read-only format.
    // Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PortugalNumeroDeIdentificacaoFiscalView label="Tax Identification Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

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

<!-- PortugalNumeroDeIdentificacaoFiscalView.svelte -->
<span
    class={`portugal-numero-de-identificacao-fiscal-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
