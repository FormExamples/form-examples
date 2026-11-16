<script lang="ts">
    // CeskoRodneCisloView component
    //
    // A headless display component for showing Czech Republic's
    // Rodné číslo (RČ) in a read-only format.
    // Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <CeskoRodneCisloView label="Czech Personal Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

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

<!-- CeskoRodneCisloView.svelte -->
<span
    class={`cesko-rodne-cislo-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
