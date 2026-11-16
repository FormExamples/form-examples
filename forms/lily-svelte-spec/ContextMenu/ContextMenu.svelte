<script lang="ts">
    // ContextMenu component
    //
    // A headless context menu that displays a list of actions relevant to the current
    // context, typically triggered by a right-click or long-press. When opened, focus
    // moves to the first menu item automatically. Arrow keys navigate between items
    // with wrapping, and Escape closes the menu. Consumers trigger opening externally
    // and provide role="menuitem" children. Used with ContextMenuItem children.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the context menu via aria-label.
    //   open — boolean, default false. Whether the menu is visible; bindable for two-way control.
    //   children — Snippet, required. Menu item content (should include role="menuitem" elements).
    //   ...restProps — additional HTML attributes spread onto the menu <div>.
    //
    // Syntax:
    //   <ContextMenu label="Actions" bind:open>
    //     <ContextMenuItem>Cut</ContextMenuItem>
    //   </ContextMenu>
    //
    // Examples:
    //   <!-- Context menu with multiple actions -->
    //   <ContextMenu label="Actions" bind:open>
    //     <li role="menuitem" tabindex="-1">Cut</li>
    //     <li role="menuitem" tabindex="-1">Copy</li>
    //     <li role="menuitem" tabindex="-1">Paste</li>
    //   </ContextMenu>
    //
    // Keyboard:
    //   - ArrowDown: Move focus to the next menu item (wraps to first)
    //   - ArrowUp: Move focus to the previous menu item (wraps to last)
    //   - Home: Move focus to the first menu item
    //   - End: Move focus to the last menu item
    //   - Escape: Close the menu
    //
    // Accessibility:
    //   - role="menu" identifies the container as a menu widget
    //   - aria-label provides an accessible name for the menu
    //   - Focus is automatically moved to the first menuitem when opened via $effect
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //   - All menu item content is provided by consumers through children
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: use with ContextMenuItem for individual entries
    //   - Consumer triggers opening externally (e.g., via contextmenu event handler)
    //
    // References:
    //   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import { popoverState, toggleOpened } from "../Popover/popover.js";

    let {
        class: className = "",
        label,
        open = $bindable(false),
        children,
        ...restProps
    }: {
        /** Accessible name for the context menu. */
        label: string;
        /** Whether the menu is visible. Bindable for two-way control. */
        open?: boolean;
        /** Menu item content rendered inside the menu list. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "ContextMenu",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    // Reference to the menu element for focus management.
    let menuRef: HTMLElement | undefined = $state(undefined);

    // When the menu opens, focus the first menuitem.
    $effect(() => {
        if (open && menuRef) {
            const firstItem = menuRef.querySelector<HTMLElement>("[role='menuitem']");
            firstItem?.focus();
        }
    });

    // Keyboard navigation within the menu.
    function onkeydown(event: KeyboardEvent) {
        if (!menuRef) return;
        const items = Array.from(menuRef.querySelectorAll<HTMLElement>("[role='menuitem']"));
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
            case "Escape": {
                event.preventDefault();
                open = false;
                break;
            }
        }
    }
</script>

<!-- popover="auto": there is no declarative trigger (a right-click or long-press opens it), so popoverState shows it
     with showPopover() when `open` turns true, in the top layer; light dismiss and Escape come from the browser and the
     toggle event writes `open` back. Positioning at the pointer stays the consumer's CSS. -->
<div
    class={`context-menu ${className}`}
    role="menu"
    aria-label={label}
    popover="auto"
    bind:this={menuRef}
    use:popoverState={open}
    ontoggle={(event) => (open = toggleOpened(event))}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</div>
