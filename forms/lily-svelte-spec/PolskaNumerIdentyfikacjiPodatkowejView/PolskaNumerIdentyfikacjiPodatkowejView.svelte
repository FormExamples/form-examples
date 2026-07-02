<script lang="ts">
    // PolskaNumerIdentyfikacjiPodatkowejView component
    //
    // A headless display component for showing Poland's
    // Numer Identyfikacji Podatkowej (NIP) in a read-only format.
    // Format: 10 numeric digits used for tax identification.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PolskaNumerIdentyfikacjiPodatkowejView label="Tax Identification Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Poland

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

<!-- PolskaNumerIdentyfikacjiPodatkowejView.svelte -->
<span
    class={`polska-numer-identyfikacji-podatkowej-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
