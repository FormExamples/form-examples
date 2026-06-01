<script lang="ts">
    // NederlandPaspoortNummerView component
    //
    // A headless display component for showing Netherlands's
    // Paspoort Nummer in a read-only format.
    // Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9].
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <NederlandPaspoortNummerView label="Dutch Passport Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Dutch_passport

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

<!-- NederlandPaspoortNummerView.svelte -->
<span
    class={`nederland-paspoort-nummer-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
