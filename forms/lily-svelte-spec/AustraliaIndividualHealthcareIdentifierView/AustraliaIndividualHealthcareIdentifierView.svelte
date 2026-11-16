<script lang="ts">
    // AustraliaIndividualHealthcareIdentifierView component
    //
    // A headless display component for showing Australia's
    // Individual Healthcare Identifier (IHI) in a read-only format.
    // Format: 16 digits assigned by the Healthcare Identifiers Service.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AustraliaIndividualHealthcareIdentifierView label="Individual Healthcare Identifier" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/My_Health_Record

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

<!-- AustraliaIndividualHealthcareIdentifierView.svelte -->
<span
    class={`australia-individual-healthcare-identifier-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
