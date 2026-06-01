<script lang="ts">
    // IslandKennitalaView component
    //
    // A headless display component for showing Iceland's
    // Kennitala in a read-only format.
    // Format: 10 digits where the first 6 are the date of birth (DDMMYY).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <IslandKennitalaView label="Personal Identity Code" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Kennitala

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

<!-- IslandKennitalaView.svelte -->
<span
    class={`island-kennitala-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
