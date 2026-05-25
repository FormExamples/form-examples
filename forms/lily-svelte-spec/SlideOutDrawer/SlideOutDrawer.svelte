<script lang="ts">
    // SlideOutDrawer component
    //
    // A headless slide-out drawer that renders a modal dialog container which
    // slides in from the side of the screen. When open, it can be dismissed with
    // the Escape key. Commonly used for navigation menus, filters, settings panels,
    // or secondary content in mobile and web applications.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the dialog via aria-label.
    //   open — boolean, default false. Whether the drawer is visible; bindable via bind:open.
    //   children — Snippet, required. The drawer content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
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
    //   - Escape: closes the drawer by setting open to false
    //
    // Accessibility:
    //   - role="dialog" for modal overlay semantics
    //   - aria-label describes the drawer purpose
    //   - aria-modal="true" indicates modal behavior (content behind is inert)
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
    //   - Consumer implements focus trapping and slide animations via CSS
    //
    // References:
    //   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
    //   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

    import type { Snippet } from "svelte";

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

    // Handle keyboard events on the drawer.
    // Escape key closes the drawer, matching standard dialog behavior.
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            open = false;
        }
    }
</script>

<!-- SlideOutDrawer: a modal dialog container, conditionally rendered -->
{#if open}
    <div
        class={`slide-out-drawer ${className}`}
        role="dialog"
        aria-label={label}
        aria-modal="true"
        tabindex="-1"
        onkeydown={handleKeydown}
        {...restProps}
    >
        {@render children?.()}
    </div>
{/if}
