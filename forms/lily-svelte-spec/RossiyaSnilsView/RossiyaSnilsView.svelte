<script lang="ts">
    // RossiyaSnilsView component
    //
    // A headless display component for showing Russia's
    // СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta) in a read-only format.
    // Format: Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <RossiyaSnilsView label="СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/SNILS_(Russia)

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

<!-- RossiyaSnilsView.svelte -->
<span
    class={`rossiya-snils-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
