<script lang="ts">
    // CymruRhifYGwasanaethIechydGwladolView component
    //
    // A headless display component for showing Wales's
    // Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG) in a read-only format.
    // Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <CymruRhifYGwasanaethIechydGwladolView label="National Health Service Number" value={value} />
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

<!-- CymruRhifYGwasanaethIechydGwladolView.svelte -->
<span
    class={`cymru-rhif-y-gwasanaeth-iechyd-gwladol-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
