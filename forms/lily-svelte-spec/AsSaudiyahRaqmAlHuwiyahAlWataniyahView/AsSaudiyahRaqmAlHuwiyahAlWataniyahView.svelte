<script lang="ts">
    // AsSaudiyahRaqmAlHuwiyahAlWataniyahView component
    //
    // A headless display component for showing Saudi Arabia's
    // National Identification Number in a read-only format.
    // Format: Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AsSaudiyahRaqmAlHuwiyahAlWataniyahView label="National Identification Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identity_card

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

<!-- AsSaudiyahRaqmAlHuwiyahAlWataniyahView.svelte -->
<span
    class={`as-saudiyah-raqm-al-huwiyah-al-wataniyah-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
