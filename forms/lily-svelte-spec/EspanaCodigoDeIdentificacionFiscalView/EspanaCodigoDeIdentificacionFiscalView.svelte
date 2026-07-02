<script lang="ts">
    // EspanaCodigoDeIdentificacionFiscalView component
    //
    // A headless display component for showing Spain's
    // Código de Identificación Fiscal (CIF) in a read-only format.
    // Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <EspanaCodigoDeIdentificacionFiscalView label="Tax Identification Code" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

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

<!-- EspanaCodigoDeIdentificacionFiscalView.svelte -->
<span
    class={`espana-codigo-de-identificacion-fiscal-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
