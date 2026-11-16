<script lang="ts">
    // Sheet component
    //
    // A headless sliding panel overlay that appears from an edge of the viewport,
    // functioning as a modal dialog: while open it renders a native <dialog> opened
    // with showModal() (see ../Dialog/modal.ts), so the page behind it is inert, Tab
    // stays inside it, and focus returns to the opener when it closes.
    // Conditionally rendered based on the open state, with Escape key to dismiss. Commonly used for navigation menus, settings panels,
    // detail views, or filter interfaces that slide in from the top, right, bottom, or left.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the sheet dialog via aria-label.
    //   open — boolean, default false. Whether the sheet is visible; bindable via bind:open.
    //   side — "left" | "right" | "top" | "bottom", default "right". Which edge the sheet appears from.
    //   children — Snippet, required. Content to render inside the sheet.
    //   ...restProps — additional HTML attributes spread onto the <dialog>.
    //
    // Syntax:
    //   <Sheet label="Settings" bind:open side="right">
    //     <p>Sheet content</p>
    //   </Sheet>
    //
    // Examples:
    //   <!-- Left-side navigation sheet -->
    //   <Sheet label="Navigation" bind:open={navOpen} side="left">
    //     <nav><a href="/">Home</a></nav>
    //   </Sheet>
    //
    //   <!-- Bottom sheet for mobile actions -->
    //   <Sheet label="Actions" bind:open={actionsOpen} side="bottom">
    //     <button>Share</button>
    //     <button>Delete</button>
    //   </Sheet>
    //
    // Keyboard:
    //   - Escape: closes the sheet by setting open to false (also the native cancel event)
    //   - Tab: moves focus between focusable elements within the sheet; showModal() keeps it inside
    //
    // Accessibility:
    //   - role="dialog" provided natively by the <dialog> element
    //   - aria-label provides an accessible name for the dialog
    //   - aria-modal="true" is true: showModal() makes the content behind inert
    //   - focus moves into the sheet on open and returns to the opener on close
    //   - tabindex="-1" allows programmatic focus on the dialog container
    //   - data-side attribute exposes the side for CSS targeting
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Open uses $bindable() for two-way binding with bind:open
    //   - Focus trapping comes from showModal() via ../Dialog/modal.ts (open-attribute fallback where it is
    //     missing, e.g. jsdom); consumer implements slide-in animations via CSS
    //   - Completely removed from DOM when closed ({#if open})
    //
    // References:
    //   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import { modalDialog } from "../Dialog/modal.js";

    let {
        class: className = "",
        label,
        open = $bindable(false),
        side = "right",
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Whether the sheet is open. Bindable. */
        open?: boolean;
        /** Edge from which the sheet appears. */
        side?: "left" | "right" | "top" | "bottom";
        /** Sheet content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Sheet", label, restProps["aria-label"], restProps["aria-labelledby"]),
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

<!-- Sheet.svelte -->
{#if open}
    <dialog
        class={`sheet ${className}`}
        aria-label={label}
        aria-modal="true"
        tabindex="-1"
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
