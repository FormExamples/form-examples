<script lang="ts">
    // TaiwanGuominShenfenzhengTongyiBianhaoView component
    //
    // A headless display component for showing Taiwan's
    // National Identification Card Number in a read-only format.
    // Format: One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <TaiwanGuominShenfenzhengTongyiBianhaoView label="National Identification Card Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)

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

<!-- TaiwanGuominShenfenzhengTongyiBianhaoView.svelte -->
<span
    class={`taiwan-guomin-shenfenzheng-tongyi-bianhao-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
