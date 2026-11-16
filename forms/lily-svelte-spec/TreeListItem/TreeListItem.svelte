<script lang="ts">
    // TreeListItem component
    //
    // One node of a tree navigation. Renders an <li role="treeitem"> with the `tree-list-item` hook that
    // owns the WAI-ARIA tree arrow-key behaviour for itself: open, close, and move to the first child or
    // the parent. It is a roving-tabindex item (tabindex -1); the parent TreeList decides which item is
    // tabbable.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   expanded — boolean, optional, bindable. true or false for a branch (rendered as aria-expanded); leave undefined for a leaf, which renders no aria-expanded.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <li>.
    //
    // Syntax:
    //   <TreeListItem bind:expanded label="…">…</TreeListItem>
    //
    // Examples:
    //   <TreeListItem bind:expanded={open} label="Documents"><TreeLink href="/docs">Documents</TreeLink><TreeList>…</TreeList></TreeListItem>
    //
    // Keyboard:
    //   - ArrowRight (ArrowLeft in right-to-left): on a closed branch, opens it; on an open branch, moves focus to its first child
    //   - ArrowLeft (ArrowRight in right-to-left): on an open branch, closes it; otherwise moves focus to the parent item
    //   - The keys act only when the item itself has focus, not when the event bubbled up from a nested item
    //   - Up/Down, Home, End and type-ahead are the parent TreeList's, not this item's
    //
    // Accessibility:
    //   - role="treeitem" with aria-expanded for branches (omitted for leaves)
    //   - tabindex="-1": focusable by script, reached by the roving tabindex of the tree
    //   - Direction is read from the computed `direction` style, so right-to-left layouts swap the keys
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The expanded state is bindable; the consumer shows or hides the child list from it
    //
    // References:
    //   - WAI-ARIA tree pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        expanded = $bindable(undefined),
        children,
        ...restProps
    }: {
        label?: string;
        /** Expanded state, bindable. Leave undefined for a leaf (no aria-expanded). */
        expanded?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    // ArrowRight/ArrowLeft (WAI-ARIA tree pattern). Only for the focused item itself, not a
    // nested one the event bubbled up from. Swapped in right-to-left layouts.
    function onkeydown(event: KeyboardEvent) {
        const item = event.currentTarget as HTMLElement;
        if (event.target !== item) return;
        const rtl = getComputedStyle(item).direction === "rtl";
        const open = rtl ? "ArrowLeft" : "ArrowRight";
        const close = rtl ? "ArrowRight" : "ArrowLeft";
        if (event.key === open) {
            if (expanded === false) {
                event.preventDefault();
                expanded = true;
            } else if (expanded === true) {
                const child = item.querySelector<HTMLElement>("[role='treeitem']");
                if (child) {
                    event.preventDefault();
                    child.focus();
                }
            }
        } else if (event.key === close) {
            if (expanded === true) {
                event.preventDefault();
                expanded = false;
            } else {
                const parent = item.parentElement?.closest<HTMLElement>("[role='treeitem']");
                if (parent) {
                    event.preventDefault();
                    parent.focus();
                }
            }
        }
    }
</script>

<!-- TreeListItem.svelte -->
<li
    class={`tree-list-item ${className}`}
    role="treeitem"
    tabindex="-1"
    aria-label={label}
    aria-expanded={expanded}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</li>
