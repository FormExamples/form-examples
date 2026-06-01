<script lang="ts">
    // PortugalPassaporteView component
    //
    // A headless display component for showing Portugal's
    // Passaporte in a read-only format.
    // Format: 1 letter [A-Z] and 6 digits [0-9].
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PortugalPassaporteView label="Portuguese Passport" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Portuguese_passport

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

<!-- PortugalPassaporteView.svelte -->
<span
    class={`portugal-passaporte-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
