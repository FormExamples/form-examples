<script lang="ts">
    // BulgariaEdinenGrazhdanskiNomerView component
    //
    // A headless display component for showing Bulgaria's
    // Единен граждански номер / Edinen grazhdanski nomer (EGN) in a read-only format.
    // Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <BulgariaEdinenGrazhdanskiNomerView label="Uniform Civil Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_citizenship_number

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

<!-- BulgariaEdinenGrazhdanskiNomerView.svelte -->
<span
    class={`bulgaria-edinen-grazhdanski-nomer-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
