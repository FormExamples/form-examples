<script lang="ts">
    // CeskoCestovniPasView component
    //
    // A headless display component for showing Czech Republic's
    // Cestovní pas in a read-only format.
    // Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <CeskoCestovniPasView label="Czech Passport" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Czech_passport

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

<!-- CeskoCestovniPasView.svelte -->
<span
    class={`cesko-cestovni-pas-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
