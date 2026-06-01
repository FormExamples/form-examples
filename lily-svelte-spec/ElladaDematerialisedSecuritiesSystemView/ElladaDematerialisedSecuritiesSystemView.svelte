<script lang="ts">
    // ElladaDematerialisedSecuritiesSystemView component
    //
    // A headless display component for showing Greece's
    // Dematerialised Securities System (DSS) in a read-only format.
    // Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <ElladaDematerialisedSecuritiesSystemView label="Dematerialised Securities System" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Central_Securities_Depository

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

<!-- ElladaDematerialisedSecuritiesSystemView.svelte -->
<span
    class={`ellada-dematerialised-securities-system-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
