<script lang="ts">
    // Badge component
    //
    // A headless inline badge for displaying status indicators, counts, or
    // short labels. Renders as a <span role="status"> with aria-label and
    // data-type for consumer styling. Commonly used for notification counts,
    // "New" labels, status pills, and category tags.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   type     — "default" | "info" | "success" | "warning" | "error",
    //              default "default". Semantic variant exposed as data-type.
    //   label    — string, optional. Accessible label for screen readers
    //              when badge text alone is insufficient (e.g., "3 unread messages").
    //   children — Snippet, required. The badge content (text, number, etc.).
    //   ...restProps — additional HTML attributes spread onto <span>.
    //
    // Syntax:
    //   <Badge>New</Badge>
    //   <Badge label="3 unread messages">3</Badge>
    //
    // Examples:
    //   <!-- Simple text badge -->
    //   <Badge>New</Badge>
    //
    //   <!-- Count badge with accessible context -->
    //   <Badge label="3 unread messages">3</Badge>
    //
    //   <!-- Warning badge -->
    //   <Badge type="warning">Alert</Badge>
    //
    //   <!-- Error badge with custom attributes -->
    //   <Badge type="error" data-testid="error-badge">Failed</Badge>
    //
    // Keyboard: None — badges are display-only, not interactive.
    //
    // Accessibility:
    //   - role="status" for live region semantics (screen readers announce changes)
    //   - aria-label provides additional context beyond the visible text
    //   - data-type exposes variant for consumer styling (not for assistive tech)
    //
    // Internationalization:
    //   - All text comes through children snippet and label prop
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Use role="status" for dynamic badges; consumer can override role if static
    //   - data-type is for styling hooks, not semantics
    //   - Do not add icons or colors; consumer provides visual treatment
    //
    // References:
    //   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        type = "default",
        label = undefined,
        children,
        ...restProps
    }: {
        /** Badge variant for semantic meaning */
        type?: "default" | "info" | "success" | "warning" | "error";
        /** Accessible label for screen readers */
        label?: string;
        /** The badge content (text, number, etc.) */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Badge.svelte -->
<span
    class={`badge ${className}`}
    role="status"
    aria-label={label}
    data-type={type}
    {...restProps}
>
    {@render children?.()}
</span>
