<script lang="ts">
    // ScrollArea component
    //
    // A headless scrollable container that provides keyboard accessibility for
    // overflowing content. Renders a focusable <div> region so keyboard users can
    // scroll through long lists, code blocks, chat messages, or data tables using
    // standard scrolling keys without needing a mouse.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the scrollable region via aria-label.
    //   children — Snippet, required. Scrollable content to render inside the container.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ScrollArea label="Scrollable content">
    //     <p>Long content...</p>
    //   </ScrollArea>
    //
    // Examples:
    //   <!-- Chat messages area -->
    //   <ScrollArea label="Chat messages">
    //     {#each messages as msg}<p>{msg}</p>{/each}
    //   </ScrollArea>
    //
    //   <!-- Code block with custom styling -->
    //   <ScrollArea label="Source code" style="overflow:auto; max-height:300px;">
    //     <pre><code>{source}</code></pre>
    //   </ScrollArea>
    //
    // Keyboard:
    //   - Tab: moves focus to the scroll area container
    //   - Arrow Up/Down: scrolls content vertically (native browser behavior)
    //   - Arrow Left/Right: scrolls content horizontally (native browser behavior)
    //   - Page Up/Down: scrolls by one page (native browser behavior)
    //   - Home/End: scrolls to beginning or end (native browser behavior)
    //
    // Accessibility:
    //   - role="region" identifies the container as a landmark
    //   - aria-label describes what content is scrollable
    //   - tabindex="0" makes the container keyboard-focusable for scrolling
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer must apply CSS overflow and dimension properties for actual scrolling
    //   - No internal scroll logic — relies on native browser scroll behavior
    //
    // References:
    //   - WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
    //   - WCAG 2.1 Reflow: https://www.w3.org/WAI/WCAG21/Understanding/reflow.html

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Scrollable content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ScrollArea.svelte -->
<div
    class={`scroll-area ${className}`}
    role="region"
    aria-label={label}
    tabindex="0"
    {...restProps}
>
    {@render children?.()}
</div>
