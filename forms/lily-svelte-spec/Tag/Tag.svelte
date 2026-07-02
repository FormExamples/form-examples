<script lang="ts">
    // Tag component
    //
    // A headless tag for displaying labels, categories, keywords, or status
    // indicators. Renders as an inline <span> with role="status" and an accessible
    // label, creating an implicit live region so screen readers announce content
    // changes. Commonly used in content management, product listings, article
    // metadata, and filtering interfaces to visually group or classify content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   children — Snippet, required. The tag's visible content (text, etc.).
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <Tag label="Category">Design</Tag>
    //
    // Examples:
    //   <!-- Status tag -->
    //   <Tag label="Status">Active</Tag>
    //
    //   <!-- Priority tag with expanded context -->
    //   <Tag label="Priority: High">High</Tag>
    //
    // Keyboard:
    //   - None -- tags are informational, not interactive
    //
    // Accessibility:
    //   - role="status" enables live region announcements for screen readers
    //   - aria-label provides expanded context beyond the visible tag text
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //   - All visible content is provided through the children snippet
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - role="status" creates an implicit live region
    //
    // References:
    //   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label for screen readers */
        label: string;
        /** The tag content (text, icon, etc.) */
        children: Snippet;
        /** Additional HTML attributes */
        [key: string]: unknown;
    } = $props();
</script>

<!-- Tag.svelte -->
<span
    class={`tag ${className}`}
    role="status"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</span>
