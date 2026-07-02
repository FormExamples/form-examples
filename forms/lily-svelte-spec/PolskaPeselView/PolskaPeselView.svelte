<script lang="ts">
    // PolskaPeselView component
    //
    // A headless display component for showing Poland's
    // PESEL in a read-only format.
    // Format: 11 numeric digits; assigned shortly after birth and unchanged for life.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PolskaPeselView label="PESEL" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/PESEL

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

<!-- PolskaPeselView.svelte -->
<span
    class={`polska-pesel-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
