<script lang="ts">
    // Drawer component
    //
    // A panel that slides in from an edge of the viewport, typically used for
    // navigation menus, filters, or supplementary content. It is modal: while open
    // it renders a native <dialog> opened with showModal() (see ../Dialog/modal.ts),
    // so the browser puts it in the top layer, makes the page behind it inert,
    // traps Tab inside it and, on close, focus returns to the element that opened
    // it. The side prop indicates which edge via a data-side attribute for
    // consumer positioning and animation styles.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   open — boolean, default false. Whether the drawer is visible; bindable.
    //   label — string, required. Accessible name for the drawer.
    //   side — "left" | "right" | "top" | "bottom", default "left". Edge the drawer enters from.
    //   children — Snippet, required. Drawer content.
    //   ...restProps — additional HTML attributes spread onto the <dialog>.
    //
    // Syntax:
    //   <Drawer label="Nav" bind:open side="left">Content</Drawer>
    //
    // Examples:
    //   <!-- Navigation drawer from left -->
    //   <Drawer label="Navigation" bind:open side="left">
    //     <nav>...</nav>
    //   </Drawer>
    //
    //   <!-- Filters drawer from right -->
    //   <Drawer label="Filters" bind:open={showFilters} side="right">
    //     <form>...</form>
    //   </Drawer>
    //
    // Keyboard:
    //   - Escape: closes the drawer by setting open to false (also the native cancel event)
    //   - Tab: stays inside the drawer while it is open (showModal() makes the page inert)
    //
    // Accessibility:
    //   - role="dialog" provided natively by the <dialog> element
    //   - aria-label provides the accessible name
    //   - aria-modal="true" is true: showModal() makes the rest of the page inert
    //   - focus moves into the drawer on open and returns to the opener on close
    //   - tabindex="-1" lets the drawer itself take focus when it has no focusable child
    //   - data-side attribute conveys position for consumer styling
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable() on open for two-way state binding
    //   - Drawer is removed from DOM when open is false
    //   - Opened with showModal() via ../Dialog/modal.ts; where showModal is missing (jsdom) it falls back to
    //     the open attribute
    //   - Consumer uses data-side for positioning CSS
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import { modalDialog } from "../Dialog/modal.js";

    let {
        class: className = "",
        open = $bindable(false),
        label,
        side = "left",
        children,
        ...restProps
    }: {
        /** Whether the drawer is visible. Bindable. */
        open?: boolean;
        /** Accessible name for the drawer. */
        label: string;
        /** Edge the drawer enters from. */
        side?: "left" | "right" | "top" | "bottom";
        /** Drawer content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Drawer", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && !event.defaultPrevented) {
            event.preventDefault();
            open = false;
        }
    }
    function oncancel(event: Event) {
        event.preventDefault();
        open = false;
    }
    function onclose() {
        open = false;
    }
    // Open as a real modal, then make sure focus is inside: showModal() already moves it in a browser, the
    // open-attribute fallback does not.
    function modal(node: HTMLDialogElement) {
        const action = modalDialog(node, true);
        if (!node.contains(document.activeElement)) node.focus();
        return action;
    }
</script>

{#if open}
    <!-- Drawer.svelte -->
    <dialog
        class={`drawer ${className}`}
        tabindex="-1"
        aria-label={label}
        aria-modal="true"
        data-side={side}
        use:modal
        {onkeydown}
        {oncancel}
        {onclose}
        {...restProps}
    >
        {@render children?.()}
    </dialog>
{/if}
