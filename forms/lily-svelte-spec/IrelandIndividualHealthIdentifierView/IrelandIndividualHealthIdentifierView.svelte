<script lang="ts">
    // IrelandIndividualHealthIdentifierView component
    //
    // A headless display component for showing an Ireland Individual Health
    // Identifier (IHI) in a read-only format. The IHI is a 10-digit clinical
    // identifier used by the HSE to match patients with medical records.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label via aria-label.
    //   value — string, default "". The IHI string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <IrelandIndividualHealthIdentifierView label="IHI" value="1234567890" />
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Companion to IrelandIndividualHealthIdentifierInput

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

<!-- IrelandIndividualHealthIdentifierView.svelte -->
<span
    class={`ireland-individual-health-identifier-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span>
