<script lang="ts">
    // HrvatskaOsobniIdentifikacijskiBrojView component
    //
    // A headless display component for showing Croatia's
    // Osobni identifikacijski broj (OIB) in a read-only format.
    // Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <HrvatskaOsobniIdentifikacijskiBrojView label="Personal Identification Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

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

<!-- HrvatskaOsobniIdentifikacijskiBrojView.svelte -->
<span
    class={`hrvatska-osobni-identifikacijski-broj-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
