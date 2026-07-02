<script lang="ts">
    // AustraliaIndividualHealthcareIdentifierView component
    //
    // A headless display component for showing Australia's
    // Individual Healthcare Identifier (IHI) in a read-only format.
    // Format: 16 digits assigned by the Healthcare Identifiers Service.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AustraliaIndividualHealthcareIdentifierView label="Individual Healthcare Identifier" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/My_Health_Record

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AustraliaIndividualHealthcareIdentifierView.svelte -->
<span
    class={`australia-individual-healthcare-identifier-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
