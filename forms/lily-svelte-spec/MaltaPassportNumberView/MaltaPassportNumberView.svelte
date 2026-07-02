<script lang="ts">
    // MaltaPassportNumberView component
    //
    // A headless display component for showing Malta's
    // Malta Passport Number in a read-only format.
    // Format: 7 numerical digits issued by the Civil Registration Directorate.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MaltaPassportNumberView label="Malta Passport Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Maltese_passport

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

<!-- MaltaPassportNumberView.svelte -->
<span
    class={`malta-passport-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
