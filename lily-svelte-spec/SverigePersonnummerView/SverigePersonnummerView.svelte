<script lang="ts">
    // SverigePersonnummerView component
    //
    // A headless display component for showing Sweden's
    // Personnummer in a read-only format.
    // Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <SverigePersonnummerView label="Personal Identity Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

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

<!-- SverigePersonnummerView.svelte -->
<span
    class={`sverige-personnummer-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
