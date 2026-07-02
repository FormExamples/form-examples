<script lang="ts">
    // NorgeFodselsnummerView component
    //
    // A headless display component for showing Norway's
    // Fødselsnummer in a read-only format.
    // Format: 11 digits where the first 6 represent the date of birth (DDMMYY).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <NorgeFodselsnummerView label="Norwegian Birth Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Norway

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

<!-- NorgeFodselsnummerView.svelte -->
<span
    class={`norge-fodselsnummer-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
