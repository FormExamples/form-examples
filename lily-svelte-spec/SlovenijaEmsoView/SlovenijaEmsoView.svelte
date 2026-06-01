<script lang="ts">
    // SlovenijaEmsoView component
    //
    // A headless display component for showing Slovenia's
    // Enotna Matična Številka Občana (EMŠO) in a read-only format.
    // Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <SlovenijaEmsoView label="Unique Master Citizen Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number

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

<!-- SlovenijaEmsoView.svelte -->
<span
    class={`slovenija-emso-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
