<script lang="ts">
    // CymruRhifYGwasanaethIechydGwladolView component
    //
    // A headless display component for showing Wales's
    // Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG) in a read-only format.
    // Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <CymruRhifYGwasanaethIechydGwladolView label="National Health Service Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/NHS_number

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

<!-- CymruRhifYGwasanaethIechydGwladolView.svelte -->
<span
    class={`cymru-rhif-y-gwasanaeth-iechyd-gwladol-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
