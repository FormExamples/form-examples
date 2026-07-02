<script lang="ts">
    // DeutschlandKrankenversichertennummerView component
    //
    // A headless display component for showing Germany's
    // Krankenversichertennummer (KVNR) in a read-only format.
    // Format: a random capital letter followed by eight random digits and a Luhn check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <DeutschlandKrankenversichertennummerView label="Health Insurance Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://de.wikipedia.org/wiki/Krankenversichertennummer

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

<!-- DeutschlandKrankenversichertennummerView.svelte -->
<span
    class={`deutschland-krankenversichertennummer-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
