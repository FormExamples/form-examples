<script lang="ts">
    // SlovenskoPasView component
    //
    // A headless display component for showing Slovakia's
    // Pas in a read-only format.
    // Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <SlovenskoPasView label="Slovak Passport" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Slovak_passport

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

<!-- SlovenskoPasView.svelte -->
<span
    class={`slovensko-pas-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
