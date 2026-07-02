<script lang="ts">
    // BulgariaEdinenGrazhdanskiNomerView component
    //
    // A headless display component for showing Bulgaria's
    // Единен граждански номер / Edinen grazhdanski nomer (EGN) in a read-only format.
    // Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <BulgariaEdinenGrazhdanskiNomerView label="Uniform Civil Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_citizenship_number

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

<!-- BulgariaEdinenGrazhdanskiNomerView.svelte -->
<span
    class={`bulgaria-edinen-grazhdanski-nomer-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
