<script lang="ts">
    // TreeMenu — a hierarchical tree menu with expandable branches.
    //
    // The root is a <div role="tree"> named by `label`; the consumer supplies the
    // items, each an element with role="treeitem" and tabindex="-1" (one may be
    // tabindex="0" as the tab stop). The component moves focus between them.
    //
    // Keyboard:
    //   - ArrowDown / ArrowUp: next / previous tree item, wrapping at the ends
    //   - Home / End: first / last tree item
    //
    // No CSS, no default text: the label and the items are the consumer's.
    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let root: HTMLUListElement | undefined = $state();

    function onkeydown(event: KeyboardEvent) {
        if (!root || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const items = Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
        if (items.length === 0) return;
        const current = items.indexOf(
            (event.target as Element).closest('[role="treeitem"]') as HTMLElement,
        );
        const last = items.length - 1;
        const next =
            event.key === "Home"
                ? 0
                : event.key === "End"
                  ? last
                  : event.key === "ArrowDown"
                    ? current >= last
                        ? 0
                        : current + 1
                    : current <= 0
                      ? last
                      : current - 1;
        event.preventDefault();
        items[next].focus();
    }

    $effect(() =>
        warnMissingName("TreeMenu", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );
</script>

<!-- TreeMenu.svelte -->
<ul
    bind:this={root}
    class={`tree-menu ${className}`}
    role="tree"
    aria-label={label}
    tabindex="-1"
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</ul>
