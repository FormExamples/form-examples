<script lang="ts">
    // SummaryList component
    //
    // A headless summary list that renders a semantic <dl> (description list)
    // element for presenting key-value pairs or summary information. Commonly
    // used for order summaries, account settings, form review data, or any
    // context requiring term-description pairs. The consumer provides content
    // through the children snippet, typically <dt>/<dd> pairs or SummaryListItem components.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the description list via aria-label.
    //   children — Snippet, required. List content, typically <dt>/<dd> pairs.
    //   ...restProps — additional HTML attributes spread onto the <dl>.
    //
    // Syntax:
    //   <SummaryList label="Order summary">...</SummaryList>
    //
    // Examples:
    //   <!-- Key-value pair summary -->
    //   <SummaryList label="Order summary">
    //     <dt>Product</dt><dd>Widget</dd>
    //     <dt>Quantity</dt><dd>3</dd>
    //     <dt>Total</dt><dd>$29.97</dd>
    //   </SummaryList>
    //
    // Keyboard:
    //   - None -- passive informational display, not interactive
    //
    // Accessibility:
    //   - Semantic <dl> element provides description list semantics
    //   - aria-label on the dl provides screen reader context
    //   - Screen readers announce the list and its term-description pairs
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //   - The children snippet allows localized content
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses Svelte 5 $props() rune for prop destructuring
    //
    // References:
    //   - MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
    //   - WAI-ARIA landmark regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label for the description list */
        label: string;
        /** The list content, typically dt/dd element pairs */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SummaryList: a description list for key-value pair presentation -->
<dl
    class={`summary-list ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</dl>
