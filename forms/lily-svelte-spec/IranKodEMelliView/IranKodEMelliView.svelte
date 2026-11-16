<script lang="ts">
    // IranKodEMelliView component
    //
    // A headless display component for showing Iran's
    // National Code (Kod-e Melli) in a read-only format.
    // Format: Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <IranKodEMelliView label="National Code (Kod-e Melli)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Iranian_identity_card

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

<!-- IranKodEMelliView.svelte -->
<span
    class={`iran-kod-e-melli-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
