<script lang="ts">
    // Menu component
    //
    // A headless menu container using the ARIA menu role with full vertical
    // keyboard navigation. It renders a <div> with role="menu" and manages focus
    // movement between child menuitem elements via arrow keys. Menus present a
    // list of discrete actions or commands, such as context menus, action menus
    // triggered by buttons, or dropdown menus.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name applied via aria-label.
    //   children — Snippet, required. Menu item elements (should have role="menuitem" and tabindex="-1").
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Menu label="Actions">
    //     <div role="menuitem" tabindex="-1">Cut</div>
    //   </Menu>
    //
    // Examples:
    //   <!-- Basic action menu -->
    //   <Menu label="Actions">
    //     <div role="menuitem" tabindex="-1">Cut</div>
    //     <div role="menuitem" tabindex="-1">Copy</div>
    //     <div role="menuitem" tabindex="-1">Paste</div>
    //   </Menu>
    //
    //   <!-- Dynamic menu with click handlers -->
    //   <Menu label="File actions">
    //     {#each actions as action}
    //       <div role="menuitem" tabindex="-1" onclick={() => handleAction(action)}>
    //         {action.label}
    //       </div>
    //     {/each}
    //   </Menu>
    //
    // Keyboard:
    //   - ArrowDown: move focus to next menu item, wrapping from last to first
    //   - ArrowUp: move focus to previous menu item, wrapping from first to last
    //   - Home: move focus to the first menu item
    //   - End: move focus to the last menu item
    //
    // Accessibility:
    //   - role="menu" identifies the container as a menu widget for actions
    //   - aria-label provides an accessible name describing the menu purpose
    //   - Child elements should use role="menuitem" with tabindex="-1"
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All menu item content comes through the children snippet
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: pair with MenuItem for individual menu actions
    //   - Arrow keys wrap around at boundaries
    //
    // References:
    //   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import { attachMenu } from "./menu-keys";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label for the menu. */
        label: string;
        /** Menu item elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Menu", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    let menuRef: HTMLElement | undefined = $state(undefined);

    $effect(() => (menuRef ? attachMenu(menuRef, "vertical") : undefined));
</script>

<!-- Menu.svelte -->
<div
    class={`menu ${className}`}
    role="menu"
    aria-label={label}
    bind:this={menuRef}
    {...restProps}
>
    {@render children?.()}
</div>
