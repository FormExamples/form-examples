<script lang="ts">
    // NederlandIdentiteitskaartNummerView component
    //
    // A headless display component for showing Netherlands's
    // Identiteitskaart Nummer in a read-only format.
    // Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <NederlandIdentiteitskaartNummerView label="Dutch National Identity Card Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Dutch_identity_card

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

<!-- NederlandIdentiteitskaartNummerView.svelte -->
<span
    class={`nederland-identiteitskaart-nummer-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
