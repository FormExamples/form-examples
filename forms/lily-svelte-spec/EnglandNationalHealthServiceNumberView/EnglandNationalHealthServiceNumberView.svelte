<script lang="ts">
    // EnglandNationalHealthServiceNumberView component
    //
    // A headless display component for showing England's
    // National Health Service Number (NHS) in a read-only format.
    // Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <EnglandNationalHealthServiceNumberView label="National Health Service Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/NHS_number

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

<!-- EnglandNationalHealthServiceNumberView.svelte -->
<span
    class={`england-national-health-service-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
