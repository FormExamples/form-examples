<script lang="ts">
    // FileTree component
    //
    // A headless hierarchical tree (folders and files) following the WAI-ARIA APG
    // tree pattern. The consumer supplies <li role="treeitem"> descendants, with a
    // nested <ul role="group"> inside each folder item and aria-expanded on folders.
    // The root owns the keyboard and a ROVING TABINDEX: exactly one visible item has
    // tabindex="0", all others -1. Opening/closing is done by toggling aria-expanded;
    // hiding a closed folder's group is consumer CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   children — Snippet. The tree items.
    //   ...restProps — additional HTML attributes spread onto the root <ul>.
    //
    // Keyboard (focus on a treeitem):
    //   - ArrowDown / ArrowUp: next / previous visible item (clamped, no wrap)
    //   - ArrowRight: closed folder opens; open folder moves to first child
    //   - ArrowLeft: open folder closes; otherwise moves to the parent folder
    //   - Home / End: first / last visible item
    //   - * : expand all sibling folders at the focused level
    //   - Printable characters: typeahead on the item's own text
    //   - Enter / Space: activate (clicks the item)
    //
    // Accessibility:
    //   - role="tree" on the root; consumer supplies treeitem/group roles and aria-selected
    //
    // Claude rules:
    //   - Headless: no CSS; state is aria-expanded only; no events beyond native click
    import { warnMissingName } from "../dev-warning";
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
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("FileTree", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    let treeRef: HTMLElement | undefined = $state(undefined);
    // Typeahead state: the characters typed so far, cleared half a second after the last one.
    let buffer = "";
    let bufferTimer: ReturnType<typeof setTimeout> | undefined;

    // Every treeitem in document order, including those inside closed folders (the DOM keeps them; only consumer CSS hides them).
    function allItems(): HTMLElement[] {
        return treeRef
            ? Array.from(treeRef.querySelectorAll<HTMLElement>("[role='treeitem']"))
            : [];
    }

    function parentItem(item: HTMLElement): HTMLElement | null {
        return item.parentElement?.closest<HTMLElement>("[role='treeitem']") ?? null;
    }

    // An item is reachable by keyboard only when no ancestor folder is closed. The state lives in `aria-expanded`, not in this component.
    function isVisible(item: HTMLElement): boolean {
        let p = parentItem(item);
        while (p) {
            if (p.getAttribute("aria-expanded") === "false") return false;
            p = parentItem(p);
        }
        return true;
    }

    function visibleItems(): HTMLElement[] {
        return allItems().filter(isVisible);
    }

    // The item's own text, excluding any nested group, so a folder is found by its name and not by the names of what it holds.
    function ownText(item: HTMLElement): string {
        let text = "";
        item.childNodes.forEach((n) => {
            if (
                n.nodeType === Node.ELEMENT_NODE &&
                (n as HTMLElement).getAttribute("role") === "group"
            )
                return;
            text += n.textContent ?? "";
        });
        return text.trim().toLowerCase();
    }

    function setStop(target: HTMLElement | undefined) {
        for (const item of allItems()) {
            item.setAttribute("tabindex", item === target ? "0" : "-1");
        }
    }

    // Keep exactly one tab stop, on a visible item. Closing a folder that held the stop would otherwise leave the tree with none, and Tab
    // could not enter it. Preference: the current stop if still visible, else the selected item, else the first.
    function normalise() {
        const visible = visibleItems();
        if (visible.length === 0) return;
        const stops = allItems().filter((i) => i.getAttribute("tabindex") === "0");
        if (stops.length === 1 && isVisible(stops[0])) return;
        const keep =
            stops.find(isVisible) ??
            visible.find((i) => i.getAttribute("aria-selected") === "true") ??
            visible[0];
        setStop(keep);
    }

    $effect(() => {
        if (!treeRef) return;
        normalise();
        // Folders open and close by attribute, and the consumer adds and removes items, so the tab stop is re-checked on either.
        const observer = new MutationObserver(normalise);
        observer.observe(treeRef, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["aria-expanded"],
        });
        return () => observer.disconnect();
    });

    // Focus arriving by click or script, not only by arrow keys, moves the tab stop to that item.
    function onfocusin(event: FocusEvent) {
        const item = (event.target as HTMLElement).closest<HTMLElement>("[role='treeitem']");
        if (item && treeRef?.contains(item)) setStop(item);
    }

    function focusItem(item: HTMLElement | undefined) {
        if (!item) return;
        setStop(item);
        item.focus();
    }

    function onkeydown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        const item = target.closest<HTMLElement>("[role='treeitem']");
        if (!item || !treeRef?.contains(item)) return;
        // Leave browser and OS shortcuts alone.
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        const visible = visibleItems();
        const index = visible.indexOf(item);
        const expanded = item.getAttribute("aria-expanded");

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                focusItem(visible[Math.min(index + 1, visible.length - 1)]);
                return;
            case "ArrowUp":
                event.preventDefault();
                focusItem(visible[Math.max(index - 1, 0)]);
                return;
            case "Home":
                event.preventDefault();
                focusItem(visible[0]);
                return;
            case "End":
                event.preventDefault();
                focusItem(visible[visible.length - 1]);
                return;
            // Right, Left, Enter and Space act only when the item itself has focus (`target === item`), so a button or field inside an item keeps its own keys.
            case "ArrowRight":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "false") {
                    item.setAttribute("aria-expanded", "true");
                } else if (expanded === "true") {
                    focusItem(
                        item.querySelector<HTMLElement>("[role='group'] [role='treeitem']") ??
                            undefined,
                    );
                }
                return;
            case "ArrowLeft":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "true") {
                    item.setAttribute("aria-expanded", "false");
                } else {
                    focusItem(parentItem(item) ?? undefined);
                }
                return;
            case "Enter":
            case " ":
                if (target !== item) return;
                event.preventDefault();
                item.click();
                return;
            // Opens the closed folders at this level only; folders inside them stay as they are.
            case "*":
                event.preventDefault();
                for (const sibling of Array.from(item.parentElement?.children ?? [])) {
                    if (
                        sibling.getAttribute("role") === "treeitem" &&
                        sibling.getAttribute("aria-expanded") === "false"
                    ) {
                        sibling.setAttribute("aria-expanded", "true");
                    }
                }
                return;
        }

        // Typeahead. Repeating one letter ("ff") steps through the items starting with it, beginning after the current item; a longer
        // string ("fo") is a prefix searched from the current item, wrapping round.
        if (event.key.length === 1) {
            event.preventDefault();
            buffer += event.key.toLowerCase();
            clearTimeout(bufferTimer);
            bufferTimer = setTimeout(() => (buffer = ""), 500);
            const cycle = buffer.length === 1 || [...buffer].every((c) => c === buffer[0]);
            const needle = cycle ? buffer[0] : buffer;
            const ordered = [
                ...visible.slice(index + (cycle ? 1 : 0)),
                ...visible.slice(0, index + (cycle ? 1 : 0)),
            ];
            focusItem(ordered.find((i) => ownText(i).startsWith(needle)));
        }
    }
</script>

<!-- FileTree.svelte -->
<ul
    class={`file-tree ${className}`}
    role="tree"
    aria-label={label}
    bind:this={treeRef}
    {onkeydown}
    {onfocusin}
    {...restProps}
>
    {@render children?.()}
</ul>
