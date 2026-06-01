<script lang="ts">
    // PostalCodeView component
    //
    // A headless display component that renders a postal or ZIP code as read-only
    // text within a <span> element. Used to present postal code information in
    // address displays, confirmation pages, shipping summaries, or any context where
    // the value is not editable. Pairs with PostalCodeInput for the Input/View pattern.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   text — string, default "". The postal code string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <PostalCodeView text="90210" />
    //
    // Examples:
    //   <!-- US ZIP code -->
    //   <PostalCodeView text="90210" />
    //
    //   <!-- UK postcode -->
    //   <PostalCodeView text="SW1A 1AA" />
    //
    //   <!-- Inline with surrounding text -->
    //   <p>Your postal code: <PostalCodeView text={postalCode} /></p>
    //
    // Keyboard:
    //   None — this is a passive display element with no interactive behavior.
    //
    // Accessibility:
    //   - No ARIA attributes needed; the <span> renders inline text natively accessible
    //     to screen readers
    //
    // Internationalization:
    //   - The text prop is the only content; no hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses the text prop, not children, for the displayed value
    //   - Do not add formatting logic — consumer provides pre-formatted postal codes
    //
    // References:
    //   - MDN span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

    let {
        class: className = "",
        text = "",
        ...restProps
    }: {
        /** The postal code text to display. */
        text?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- PostalCodeView.svelte -->
<span
    class={`postal-code-view ${className}`}
    {...restProps}>{text}</span
>
