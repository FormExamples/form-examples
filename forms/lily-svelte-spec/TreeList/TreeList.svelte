<script lang="ts">
    // TreeList component
    //
    // A headless hierarchical list using the ARIA tree role with full keyboard
    // navigation. Renders a <ul> with role="tree" and manages focus movement
    // between tree items using ArrowDown/ArrowUp with wrapping, plus Home/End
    // to jump to first/last items. Commonly used for file browsers, organizational
    // charts, nested data displays, or any hierarchical structure.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the tree via aria-label.
    //   children — Snippet, required. Tree item elements with role="treeitem".
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // Syntax:
    //   <TreeList label="File browser">...</TreeList>
    //
    // Examples:
    //   <!-- File browser tree view -->
    //   <TreeList label="File browser">
    //     <li role="treeitem" tabindex="0">Documents</li>
    //     <li role="treeitem" tabindex="-1">Photos</li>
    //     <li role="treeitem" tabindex="-1">Videos</li>
    //   </TreeList>
    //
    // Keyboard:
    //   - ArrowDown: move focus to the next tree item (wraps to first)
    //   - ArrowUp: move focus to the previous tree item (wraps to last)
    //   - Home: move focus to the first tree item
    //   - End: move focus to the last tree item
    //
    // Accessibility:
    //   - role="tree" identifies the container as a tree widget for hierarchical data
    //   - aria-label={label} provides an accessible name describing the tree
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Queries [role='treeitem'] descendants for keyboard navigation
    //   - Uses $state() for internal DOM reference
    //
    // References:
    //   - WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/TreeList/
    //   - WAI-ARIA tree role: https://www.w3.org/TR/wai-aria-1.2/#tree

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Tree item elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let treeRef: HTMLElement | undefined = $state(undefined);

    function onkeydown(event: KeyboardEvent) {
        if (!treeRef) return;
        const items = Array.from(
            treeRef.querySelectorAll<HTMLElement>("[role='treeitem']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    }
</script>

<!-- TreeList.svelte -->
<ol
    class={`tree-list ${className}`}
    role="tree"
    aria-label={label}
    bind:this={treeRef}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</ol>
