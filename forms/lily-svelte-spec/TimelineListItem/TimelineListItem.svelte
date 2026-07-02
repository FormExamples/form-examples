<script lang="ts">
    // TimelineListItem component
    //
    // A single event entry within a TimelineList ordered list. Renders a semantic
    // <li> element containing an optional <time> element for machine-readable dates
    // and an optional heading, followed by descriptive content via children. Used
    // for project milestones, activity feeds, order histories, or any chronological
    // sequence of events.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   datetime — string, optional. ISO date/time string for the <time> element.
    //   heading — string, optional. Visible date/time text rendered inside the <time> element.
    //   children — Snippet, required. Event description content.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <TimelineListItem datetime="2024-01-15" heading="Jan 15">Event description</TimelineListItem>
    //
    // Examples:
    //   <!-- Timeline entries inside a TimelineList -->
    //   <TimelineList label="Order history">
    //     <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
    //       Order placed
    //     </TimelineListItem>
    //     <TimelineListItem datetime="2024-01-16" heading="January 16, 2024">
    //       Order shipped
    //     </TimelineListItem>
    //     <TimelineListItem datetime="2024-01-19" heading="January 19, 2024">
    //       Order delivered
    //     </TimelineListItem>
    //   </TimelineList>
    //
    //   <!-- Timeline entry without a date -->
    //   <TimelineListItem>Status pending review</TimelineListItem>
    //
    // Keyboard:
    //   - None directly -- standard list item with no interactive behavior
    //
    // Accessibility:
    //   - Semantic <li> element provides list item semantics within the parent <ol>
    //   - <time> element with datetime attribute provides machine-readable date
    //   - Screen readers announce list position (e.g. "2 of 4") from the parent <ol>
    //
    // Internationalization:
    //   - The heading prop accepts any translated date/time string
    //   - All content is provided through the children snippet
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Compound component: must be used inside a TimelineList
    //   - Consumer can target <time> or data attributes for visual styling
    //
    // References:
    //   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
    //   - WAI-ARIA listitem role: https://www.w3.org/TR/wai-aria-1.2/#listitem

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        datetime = "",
        heading = "",
        children,
        ...restProps
    }: {
        /** ISO date/time string for the <time> element. */
        datetime?: string;
        /** Visible date/time text for the <time> element. */
        heading?: string;
        /** Event description content. */
        children: Snippet;
        /** Additional HTML attributes spread onto the <li>. */
        [key: string]: unknown;
    } = $props();
</script>

<!-- TimelineListItem.svelte -->
<li
    class={`timeline-list-item ${className}`}
    {...restProps}
>
    {#if datetime || heading}
        <time datetime={datetime || undefined}>{heading}</time>
    {/if}
    {@render children?.()}
</li>
