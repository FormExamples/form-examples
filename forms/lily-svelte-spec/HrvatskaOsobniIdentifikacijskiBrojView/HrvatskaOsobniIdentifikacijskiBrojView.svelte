<script lang="ts">
    // HrvatskaOsobniIdentifikacijskiBrojView component
    //
    // A headless display component for showing Croatia's
    // Osobni identifikacijski broj (OIB) in a read-only format.
    // Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <HrvatskaOsobniIdentifikacijskiBrojView label="Personal Identification Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

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

<!-- HrvatskaOsobniIdentifikacijskiBrojView.svelte -->
<span
    class={`hrvatska-osobni-identifikacijski-broj-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
