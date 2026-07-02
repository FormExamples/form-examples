<script lang="ts">
    // RomaniaPasaportView component
    //
    // A headless display component for showing Romania's
    // Paşaport in a read-only format.
    // Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <RomaniaPasaportView label="Romanian Passport" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Romanian_passport

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

<!-- RomaniaPasaportView.svelte -->
<span
    class={`romania-pasaport-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
