<script lang="ts">
    // SummaryListItem component
    //
    // A single key-value row within a SummaryList (<dl>). Renders a <div> wrapper
    // containing a <dt> (term) and <dd> (description) pair. The HTML spec permits
    // <div> as a direct child of <dl> for grouping dt/dd pairs, enabling per-row
    // styling and attribute targeting without breaking list semantics.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   term — string, required. The key/label text rendered in the <dt> element.
    //   children — Snippet, required. The value/description content rendered in the <dd>.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <SummaryListItem term="Label">Value</SummaryListItem>
    //
    // Examples:
    //   <!-- Order summary with term-description pairs -->
    //   <SummaryList label="Order summary">
    //     <SummaryListItem term="Product">Widget</SummaryListItem>
    //     <SummaryListItem term="Quantity">3</SummaryListItem>
    //     <SummaryListItem term="Total">$29.97</SummaryListItem>
    //   </SummaryList>
    //
    // Keyboard:
    //   - None -- passive informational display, not interactive
    //
    // Accessibility:
    //   - Semantic <dt> and <dd> elements provide description list semantics
    //   - Screen readers announce term-description pairs naturally
    //   - The <div> wrapper is transparent to assistive technology
    //
    // Internationalization:
    //   - The term prop externalizes the key/label string for translation
    //   - The children snippet allows localized description content
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Must be placed inside a SummaryList (<dl>) for valid HTML
    //
    // References:
    //   - MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
    //   - MDN dt element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt
    //   - MDN dd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd
    //   - HTML spec div in dl: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        term,
        children,
        ...restProps
    }: {
        /** The key/label text for this summary row. */
        term: string;
        /** The value/description content for this summary row. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SummaryListItem: a term-description pair within a description list -->
<div
    class={`summary-list-item ${className}`}
    {...restProps}
>
    <dt>{term}</dt>
    <dd>{@render children?.()}</dd>
</div>
