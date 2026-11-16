<script lang="ts">
    // UnitedStatesSocialSecurityNumberView component
    //
    // A headless display component for showing a United States Social Security
    // Number (SSN) in a read-only format. Renders the SSN as an inline <span>
    // element with an accessible label. Suitable for personal records,
    // confirmation screens, account summaries, or any context where an SSN needs
    // to be displayed but not edited. This is the View counterpart to the Input
    // component in the Input/View pattern.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The SSN string to display (e.g., "123-45-6789").
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <UnitedStatesSocialSecurityNumberView label="SSN" value="123-45-6789" />
    //
    // Examples:
    //   <!-- Display SSN with descriptive label -->
    //   <UnitedStatesSocialSecurityNumberView label="Social Security Number" value={ssn} />
    //
    // Keyboard:
    //   - None -- passive display-only component
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //   - Screen readers announce the label followed by the text content (the number)
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - No formatting, masking, or validation; consumer provides pre-formatted value
    //   - Read-only display; pairs with Input component for editing
    //
    // References:
    //   - Social Security Number: https://www.ssa.gov/history/ssn/geocard.html

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        /** Accessible label for screen readers */
        label?: string;
        /** The SSN to display */
        value?: string;
        /** Additional HTML attributes */
        [key: string]: unknown;
    } = $props();
</script>

<!-- UnitedStatesSocialSecurityNumberView.svelte -->
<span
    class={`united-states-social-security-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
