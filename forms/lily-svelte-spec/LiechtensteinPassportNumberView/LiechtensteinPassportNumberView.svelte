<script lang="ts">
    // LiechtensteinPassportNumberView component
    //
    // A headless display component for showing Liechtenstein's
    // Liechtenstein Passport Number in a read-only format.
    // Format: 1 letter followed by 5 digits (e.g. R00536).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <LiechtensteinPassportNumberView label="Liechtenstein Passport Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Liechtenstein_passport

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

<!-- LiechtensteinPassportNumberView.svelte -->
<span
    class={`liechtenstein-passport-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
