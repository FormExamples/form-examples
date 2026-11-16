<script lang="ts">
    // AgeView component
    //
    // A headless read-only display of a person's age (spec/healthcare-ui item 6). The consumer writes the words, usually
    // from ageParts() (exported with this library), which returns the age in units suited to it: minutes for a newborn,
    // weeks and days for an infant, years and months for a child, years for an adult. Lily writes no words for units.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value ("Age"), when no visible caption does.
    //   value — string, required. The age as the consumer writes it ("3 weeks 2 days", "76 years").
    //   duration — string, optional. The same age as an ISO 8601 duration (toIsoDuration: "P23D"), as data-duration.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AgeView value="3 weeks 2 days" duration="P23D" />
    let {
        class: className = "",
        label,
        value = "",
        duration,
        ...restProps
    }: {
        label?: string;
        value: string;
        duration?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AgeView.svelte -->
<span
    class={`age-view ${className}`}
    data-duration={duration}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
