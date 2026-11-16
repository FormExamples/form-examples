<script lang="ts">
    // NederlandIdentiteitskaartNummerView component
    //
    // A headless display component for showing Netherlands's
    // Identiteitskaart Nummer in a read-only format.
    // Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <NederlandIdentiteitskaartNummerView label="Dutch National Identity Card Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Dutch_identity_card

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

<!-- NederlandIdentiteitskaartNummerView.svelte -->
<span
    class={`nederland-identiteitskaart-nummer-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
