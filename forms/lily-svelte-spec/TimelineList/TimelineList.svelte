<script lang="ts">
    // TimelineList component
    //
    // A headless timeline list that renders a semantic ordered list (<ol>) with
    // an accessible label for displaying events, milestones, or activities in
    // chronological order. Commonly used for project tracking, activity feeds,
    // historical overviews, order history, or user journey visualization. The
    // consumer provides TimelineListItem children through the snippet.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the timeline via aria-label.
    //   children — Snippet, required. TimelineListItem elements.
    //   ...restProps — additional HTML attributes spread onto the <ol>.
    //
    // Syntax:
    //   <TimelineList label="Project milestones">...</TimelineList>
    //
    // Examples:
    //   <!-- Timeline with semantic time elements -->
    //   <TimelineList label="Order history">
    //     <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
    //       Order placed
    //     </TimelineListItem>
    //     <TimelineListItem datetime="2024-01-16" heading="January 16, 2024">
    //       Order shipped
    //     </TimelineListItem>
    //   </TimelineList>
    //
    // Keyboard:
    //   - None directly -- standard list navigation by screen readers
    //   - Tab moves focus between any interactive elements within items
    //
    // Accessibility:
    //   - Semantic <ol> element conveys chronological ordering to screen readers
    //   - aria-label provides the accessible name for the timeline
    //   - Screen readers announce the list with its label and item count
    //   - Consumers should use <time> elements with datetime attributes
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //   - All timeline content is provided through the children snippet
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Consumers add <time> elements for machine-readable dates
    //
    // References:
    //   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
    //   - WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label for the timeline */
        label: string;
        /** TimelineListItem elements */
        children: Snippet;
        /** Additional HTML attributes */
        [key: string]: unknown;
    } = $props();
</script>

<!-- TimelineList.svelte -->
<ol
    class={`timeline-list ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ol>
