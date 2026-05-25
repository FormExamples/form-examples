<script lang="ts">
    // Popover component
    //
    // A headless conditional dialog overlay that displays contextual information or
    // actions near the element that triggered it. It renders a <div> with role="dialog"
    // only when the open state is true, using $bindable() for two-way binding of
    // visibility. Unlike tooltips, popovers can contain rich interactive content such
    // as forms, buttons, or other controls. Commonly used for contextual menus,
    // information panels, and inline editing.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the popover dialog via aria-label.
    //   open — boolean, default false, bindable. Controls whether the popover is visible.
    //   children — Snippet, required. The popover content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Popover label="Info" bind:open>{children}</Popover>
    //
    // Examples:
    //   <!-- Popover with toggle trigger -->
    //   <button onclick={() => showPopover = !showPopover}>Toggle info</button>
    //   <Popover label="Additional information" bind:open={showPopover}>
    //     <p>Here is some contextual information.</p>
    //     <button onclick={() => showPopover = false}>Close</button>
    //   </Popover>
    //
    // Keyboard:
    //   - Escape: consumer should implement closing the popover by setting open to false
    //   - Tab: consumer should consider trapping focus within the popover when open
    //
    // Accessibility:
    //   - role="dialog" identifies the popover as a dialog overlay
    //   - aria-label provides the accessible name for the dialog
    //   - Conditionally rendered; not in the DOM when closed
    //
    // Internationalization:
    //   - The label prop is the only text; all content comes through children
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer must provide trigger element and open/close logic
    //   - Do not add focus trapping or Escape handling — consumer responsibility
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
    //   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        open = $bindable(false),
        children,
        ...restProps
    }: {
        label: string;
        open?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Popover.svelte -->
{#if open}
    <div
        class={`popover ${className}`}
        role="dialog"
        aria-label={label}
        {...restProps}
    >
        {@render children?.()}
    </div>
{/if}
