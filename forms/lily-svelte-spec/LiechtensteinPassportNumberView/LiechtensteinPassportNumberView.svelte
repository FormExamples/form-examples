<script lang="ts">
    // LiechtensteinPassportNumberView component
    //
    // A headless display component for showing Liechtenstein's
    // Liechtenstein Passport Number in a read-only format.
    // Format: 1 letter followed by 5 digits (e.g. R00536).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <LiechtensteinPassportNumberView label="Liechtenstein Passport Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Liechtenstein_passport

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

<!-- LiechtensteinPassportNumberView.svelte -->
<span
    class={`liechtenstein-passport-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
