<script lang="ts">
    // StatusLight component
    //
    // A small colored dot status indicator paired with a status label. Renders
    // a `<span class="status-light" data-variant role="status">` containing an
    // aria-hidden dot and the visible label.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   variant — variant key, default "neutral". Exposed as data-variant.
    //   label — string, REQUIRED. Status text (e.g., "Active", "Offline").
    //
    // Syntax:
    //   <StatusLight variant="positive" label="Active" />
    //
    // Accessibility:
    //   - role="status" on the container; the label provides the accessible name
    //   - the dot is aria-hidden so screen readers do not announce it
    //
    // Internationalization:
    //   - Label comes through props
    //
    // References:
    //   - Adobe Spectrum StatusLight: https://spectrum.adobe.com/page/status-light/

    type Variant =
        | "neutral"
        | "informative"
        | "positive"
        | "notice"
        | "negative"
        | "active"
        | "inactive";

    let {
        class: className = "",
        variant = "neutral",
        label,
        ...restProps
    }: {
        class?: string;
        /** Variant key exposed as data-variant */
        variant?: Variant;
        /** Status text (REQUIRED) */
        label: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- StatusLight.svelte -->
<span
    class={`status-light ${className}`}
    data-variant={variant}
    role="status"
    {...restProps}
>
    <span class="status-light-dot" aria-hidden="true"></span>
    <span class="status-light-label">{label}</span>
</span>
