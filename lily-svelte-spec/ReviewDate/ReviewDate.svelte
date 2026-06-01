<script lang="ts">
    // ReviewDate component
    //
    // A headless review date component that renders a semantic <time> element with
    // a machine-readable datetime attribute and human-readable display text via a
    // children snippet. Commonly used in dashboards, compliance tracking, audit logs,
    // and scheduling interfaces where dates must be both human-readable and machine-parseable.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   datetime — string, required. Machine-readable date/time in ISO 8601 format.
    //   children — Snippet, required. Human-readable display text for the date.
    //   ...restProps — additional HTML attributes spread onto the <time>.
    //
    // Syntax:
    //   <ReviewDate label="Next review" datetime="2025-06-15">June 15, 2025</ReviewDate>
    //
    // Examples:
    //   <!-- Dynamic date with formatted output -->
    //   <ReviewDate label="Last audit" datetime={isoDate}>{formattedDate}</ReviewDate>
    //
    //   <!-- With extra attributes -->
    //   <ReviewDate label="Due date" datetime="2025-12-31" data-urgency="high">Dec 31, 2025</ReviewDate>
    //
    // Keyboard:
    //   - None — this is an informational display, not an interactive element.
    //
    // Accessibility:
    //   - Semantic <time> element provides machine-readable date context
    //   - aria-label for screen reader context beyond the visible text
    //   - The datetime attribute enables browsers and assistive technology to parse dates
    //   - WCAG 2.2 AAA: properly labeled with semantic time element
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //   - The children snippet allows localized date formatting
    //   - The datetime attribute uses ISO 8601, which is locale-independent
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Both label and datetime are required — no defaults
    //   - Children snippet provides the human-readable date text
    //
    // References:
    //   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
    //   - ISO 8601 Date Format: https://en.wikipedia.org/wiki/ISO_8601

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        datetime,
        children,
        ...restProps
    }: {
        /** Accessible label for screen readers */
        label: string;
        /** Machine-readable date/time in ISO 8601 format */
        datetime: string;
        /** Human-readable display text for the date */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ReviewDate.svelte -->
<time
    class={`review-date ${className}`}
    aria-label={label}
    {datetime}
    {...restProps}
>
    {@render children?.()}
</time>
