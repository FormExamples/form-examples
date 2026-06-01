<script lang="ts">
    // NederlandBurgerserviceNummerView component
    //
    // A headless display component for showing Netherlands's
    // Burgerservicenummer (BSN) in a read-only format.
    // Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <NederlandBurgerserviceNummerView label="Citizen Service Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Burgerservicenummer

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

<!-- NederlandBurgerserviceNummerView.svelte -->
<span
    class={`nederland-burgerservice-nummer-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
