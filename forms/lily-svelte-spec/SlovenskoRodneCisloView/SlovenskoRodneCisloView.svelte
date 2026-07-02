<script lang="ts">
    // SlovenskoRodneCisloView component
    //
    // A headless display component for showing Slovakia's
    // Rodné číslo (RČ) in a read-only format.
    // Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <SlovenskoRodneCisloView label="Slovak Personal Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Slovakia

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

<!-- SlovenskoRodneCisloView.svelte -->
<span
    class={`slovensko-rodne-cislo-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
