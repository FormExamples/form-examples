<script lang="ts">
    // Sheet component
    //
    // A headless sliding panel overlay that appears from an edge of the viewport,
    // functioning as a modal dialog. Conditionally rendered based on the open state,
    // with Escape key to dismiss. Commonly used for navigation menus, settings panels,
    // detail views, or filter interfaces that slide in from the top, right, bottom, or left.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the sheet dialog via aria-label.
    //   open — boolean, default false. Whether the sheet is visible; bindable via bind:open.
    //   side — "left" | "right" | "top" | "bottom", default "right". Which edge the sheet appears from.
    //   children — Snippet, required. Content to render inside the sheet.
    //   ...restProps — additional HTML attributes spread onto the <div>.
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
    //   - Escape: closes the sheet by setting open to false
    //   - Tab: moves focus between focusable elements within the sheet
    //
    // Accessibility:
    //   - role="dialog" identifies the sheet as a dialog window
    //   - aria-label provides an accessible name for the dialog
    //   - aria-modal="true" indicates the dialog is modal (content behind is inert)
    //   - tabindex="-1" allows programmatic focus on the dialog container
    //   - data-side attribute exposes the side for CSS targeting
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Open uses $bindable() for two-way binding with bind:open
    //   - Consumer implements focus trapping and slide-in animations via CSS
    //   - Completely removed from DOM when closed ({#if open})
    //
    // References:
    //   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    import type { Snippet } from "svelte";

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

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            open = false;
        }
    }
</script>

<!-- Sheet.svelte -->
{#if open}
    <div
        class={`sheet ${className}`}
        role="dialog"
        aria-label={label}
        aria-modal="true"
        tabindex="-1"
        data-side={side}
        {onkeydown}
        {...restProps}
    >
        {@render children?.()}
    </div>
{/if}
