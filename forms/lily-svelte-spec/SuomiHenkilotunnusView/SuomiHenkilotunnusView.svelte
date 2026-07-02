<script lang="ts">
    // SuomiHenkilotunnusView component
    //
    // A headless display component for showing Finland's
    // Henkilötunnus (HETU) in a read-only format.
    // Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <SuomiHenkilotunnusView label="Personal Identity Code" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)

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

<!-- SuomiHenkilotunnusView.svelte -->
<span
    class={`suomi-henkilotunnus-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
