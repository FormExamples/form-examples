<script lang="ts">
    // UnitedKingdomNationalHealthServiceNumberView component
    //
    // A headless display component for showing a United Kingdom National Health
    // Service (NHS) number in a read-only format. Renders the number as an inline
    // <span> element with an accessible label. Suitable for patient records,
    // summaries, confirmation screens, or any context where an NHS number needs
    // to be displayed but not edited. This is the View counterpart to the Input
    // component in the Input/View pattern.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The NHS number string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <UnitedKingdomNationalHealthServiceNumberView label="NHS Number" value="123 456 7890" />
    //
    // Examples:
    //   <!-- Display patient NHS number -->
    //   <UnitedKingdomNationalHealthServiceNumberView label="Patient NHS Number" value={nhsNumber} />
    //
    // Keyboard:
    //   - None -- passive display-only component
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //   - Screen readers announce the label followed by the text content (the number)
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - No formatting or validation; consumer provides the value pre-formatted
    //   - Read-only display; pairs with Input component for editing
    //
    // References:
    //   - NHS Number: https://www.nhs.uk/using-the-nhs/about-the-nhs/what-is-an-nhs-number/

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        /** Accessible label for screen readers */
        label: string;
        /** The NHS number to display */
        value?: string;
        /** Additional HTML attributes */
        [key: string]: unknown;
    } = $props();
</script>

<!-- UnitedKingdomNationalHealthServiceNumberView.svelte -->
<span
    class={`united-kingdom-national-health-service-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
