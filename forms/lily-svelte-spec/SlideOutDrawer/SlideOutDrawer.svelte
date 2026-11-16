<script lang="ts">
    // SlideOutDrawer component
    //
    // A headless slide-out drawer that renders a modal dialog container which
    // slides in from the side of the screen. The container is a native <dialog>
    // opened with showModal() (see ../Dialog/modal.ts): the page behind it is inert,
    // Tab stays inside it, and focus returns to the opener when it closes. When open, it can be dismissed with
    // the Escape key. Commonly used for navigation menus, filters, settings panels,
    // or secondary content in mobile and web applications.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the dialog via aria-label.
    //   open — boolean, default false. Whether the drawer is visible; bindable via bind:open.
    //   children — Snippet, required. The drawer content.
    //   ...restProps — additional HTML attributes spread onto the <dialog>.
    //
    // Syntax:
    //   <SlideOutDrawer label="Menu" bind:open={isOpen}>
    //     <nav>Menu content</nav>
    //   </SlideOutDrawer>
    //
    // Examples:
    //   <!-- Navigation drawer with close button -->
    //   <SlideOutDrawer label="Navigation menu" bind:open={isOpen}>
    //     <nav>
    //       <ul><li><a href="/">Home</a></li></ul>
    //     </nav>
    //     <button onclick={() => isOpen = false}>Close</button>
    //   </SlideOutDrawer>
    //
    //   <!-- Settings panel -->
    //   <SlideOutDrawer label="Settings panel" bind:open={settingsOpen}>
    //     <h2>Settings</h2>
    //     <form><label><input type="checkbox" /> Enable notifications</label></form>
    //   </SlideOutDrawer>
    //
    // Keyboard:
    //   - Escape: closes the drawer by setting open to false (also the native cancel event)
    //   - Tab: stays inside the drawer while it is open
    //
    // Accessibility:
    //   - role="dialog" provided natively by the <dialog> element
    //   - aria-label describes the drawer purpose
    //   - aria-modal="true" is true: showModal() makes the content behind inert
    //   - focus moves into the drawer on open and returns to the opener on close
    //   - tabindex="-1" allows the dialog to receive programmatic focus
    //   - WCAG 2.2 AAA: properly labeled modal with keyboard dismissal
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Open uses $bindable() for two-way binding with bind:open
    //   - Completely removed from DOM when closed ({#if open})
    //   - Focus trapping comes from showModal() via ../Dialog/modal.ts (open-attribute fallback where it is
    //     missing, e.g. jsdom); consumer implements slide animations via CSS
    //
    // References:
    //   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
    //   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import { modalDialog } from "../Dialog/modal.js";

    let {
        class: className = "",
        label,
        open = $bindable(false),
        children,
        ...restProps
    }: {
        /** Accessible label for the dialog */
        label: string;
        /** Whether the drawer is open/visible, bindable */
        open?: boolean;
        /** The drawer content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "SlideOutDrawer",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    // Handle keyboard events on the drawer.
    // Escape key closes the drawer, matching standard dialog behavior.
    function handleKeydown(event: KeyboardEvent) {
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

<!-- SlideOutDrawer: a modal <dialog>, conditionally rendered and opened with showModal() -->
{#if open}
    <dialog
        class={`slide-out-drawer ${className}`}
        aria-label={label}
        aria-modal="true"
        tabindex="-1"
        use:modal
        onkeydown={handleKeydown}
        {oncancel}
        {onclose}
        {...restProps}
    >
        {@render children?.()}
    </dialog>
{/if}
