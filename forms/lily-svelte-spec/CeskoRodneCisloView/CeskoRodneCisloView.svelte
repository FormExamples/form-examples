<script lang="ts">
    // CeskoRodneCisloView component
    //
    // A headless display component for showing Czech Republic's
    // Rodné číslo (RČ) in a read-only format.
    // Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <CeskoRodneCisloView label="Czech Personal Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

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

<!-- CeskoRodneCisloView.svelte -->
<span
    class={`cesko-rodne-cislo-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
