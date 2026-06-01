<script lang="ts">
    // LietuvaPasasView component
    //
    // A headless display component for showing Lithuania's
    // Pasas in a read-only format.
    // Format: 8-digit passport or identity card number.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <LietuvaPasasView label="Lithuanian Passport" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Lithuanian_passport

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

<!-- LietuvaPasasView.svelte -->
<span
    class={`lietuva-pasas-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
