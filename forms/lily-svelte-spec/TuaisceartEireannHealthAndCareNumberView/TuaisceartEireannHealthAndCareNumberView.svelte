<script lang="ts">
    // TuaisceartEireannHealthAndCareNumberView component
    //
    // A headless display for a Tuaisceart Eireann Health and Care (H&C) Number.
    // The H&C Number is a 10-digit identifier displayed as 3-3-4 (e.g. 320 000 0001).
    //
    // Props:
    //   className — string, optional.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "".
    //   ...restProps — spread onto the <span>.
    //
    // Syntax:
    //   <TuaisceartEireannHealthAndCareNumberView label="H&C Number" value="320 000 0001" />
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Companion to TuaisceartEireannHealthAndCareNumberInput

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

<!-- TuaisceartEireannHealthAndCareNumberView.svelte -->
<span
    class={`tuaisceart-eireann-health-and-care-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
