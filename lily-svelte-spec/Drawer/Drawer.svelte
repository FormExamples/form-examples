<script lang="ts">
    // Drawer component
    //
    // A panel that slides in from an edge of the viewport, typically used for
    // navigation menus, filters, or supplementary content. Renders conditionally
    // based on the open state and uses role="dialog" with aria-modal="true" for
    // proper screen reader behavior. The side prop indicates which edge via a
    // data-side attribute for consumer positioning and animation styles.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   open — boolean, default false. Whether the drawer is visible; bindable.
    //   label — string, required. Accessible name for the drawer.
    //   side — "left" | "right" | "top" | "bottom", default "left". Edge the drawer enters from.
    //   children — Snippet, required. Drawer content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
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
    //   - Escape: closes the drawer by setting open to false
    //
    // Accessibility:
    //   - role="dialog" identifies the drawer as a dialog
    //   - aria-label provides the accessible name
    //   - aria-modal="true" indicates the drawer is modal
    //   - tabindex="-1" allows programmatic focus management
    //   - data-side attribute conveys position for consumer styling
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable() on open for two-way state binding
    //   - Drawer is removed from DOM when open is false
    //   - Consumer uses data-side for positioning CSS
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    import type { Snippet } from "svelte";

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

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            open = false;
        }
    }
</script>

{#if open}
    <!-- Drawer.svelte -->
    <div
        class={`drawer ${className}`}
        role="dialog"
        tabindex="-1"
        aria-label={label}
        aria-modal="true"
        data-side={side}
        {onkeydown}
        {...restProps}
    >
        {@render children?.()}
    </div>
{/if}
