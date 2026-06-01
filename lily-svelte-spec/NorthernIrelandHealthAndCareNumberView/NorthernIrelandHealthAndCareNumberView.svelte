<script lang="ts">
    // NorthernIrelandHealthAndCareNumberView component
    //
    // A headless display for a Northern Ireland Health and Care (H&C) Number.
    // The H&C Number is a 10-digit identifier displayed as 3-3-4 (e.g. 320 000 0001).
    //
    // Props:
    //   className — string, optional.
    //   label — string, required. Accessible label via aria-label.
    //   value — string, default "".
    //   ...restProps — spread onto the <span>.
    //
    // Syntax:
    //   <NorthernIrelandHealthAndCareNumberView label="H&C Number" value="320 000 0001" />
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Companion to NorthernIrelandHealthAndCareNumberInput

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

<!-- NorthernIrelandHealthAndCareNumberView.svelte -->
<span
    class={`northern-ireland-health-and-care-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span>
