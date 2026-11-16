<script lang="ts">
    // RomaniaPasaportView component
    //
    // A headless display component for showing Romania's
    // Paşaport in a read-only format.
    // Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <RomaniaPasaportView label="Romanian Passport" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Romanian_passport

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

<!-- RomaniaPasaportView.svelte -->
<span
    class={`romania-pasaport-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
