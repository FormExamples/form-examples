<script lang="ts">
    // PortugalNumeroDeIdentificacaoFiscalView component
    //
    // A headless display component for showing Portugal's
    // Número de Identificação Fiscal (NIF) in a read-only format.
    // Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PortugalNumeroDeIdentificacaoFiscalView label="Tax Identification Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

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

<!-- PortugalNumeroDeIdentificacaoFiscalView.svelte -->
<span
    class={`portugal-numero-de-identificacao-fiscal-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
