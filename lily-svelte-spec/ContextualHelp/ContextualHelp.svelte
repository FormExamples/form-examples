<script lang="ts">
    // ContextualHelp component
    //
    // A help button that opens a popover with explanatory content. Renders a
    // wrapper `<div>` containing a `<button>` trigger (aria-haspopup="dialog",
    // aria-expanded, aria-controls) and a `<div role="dialog">` panel that is
    // hidden when `expanded` is false. The panel id is auto-generated for
    // a stable aria-controls relationship.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the trigger button.
    //   expanded — boolean, default false. Whether the popover is open.
    //   onclick — (event: MouseEvent) => void, optional. Trigger click handler.
    //   children — Snippet, optional. Popover content.
    //
    // Syntax:
    //   <ContextualHelp label="Help" expanded={open} onclick={toggle}>
    //       <p>Help content</p>
    //   </ContextualHelp>
    //
    // Accessibility:
    //   - Trigger: aria-haspopup="dialog", aria-expanded, aria-controls
    //   - Panel: role="dialog", id matched by aria-controls
    //
    // Internationalization:
    //   - All user-facing strings via props
    //
    // References:
    //   - Adobe Spectrum ContextualHelp: https://spectrum.adobe.com/page/contextual-help/
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    import type { Snippet } from "svelte";

    function makeId(prefix: string): string {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return `${prefix}-${crypto.randomUUID()}`;
        }
        return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
    }

    let {
        class: className = "",
        label,
        expanded = false,
        onclick = undefined,
        children = undefined,
        ...restProps
    }: {
        class?: string;
        /** Accessible label for the trigger (REQUIRED) */
        label: string;
        /** Whether the popover is open */
        expanded?: boolean;
        /** Trigger click handler */
        onclick?: (event: MouseEvent) => void;
        /** Popover content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const panelId = makeId("contextual-help-panel");
</script>

<!-- ContextualHelp.svelte -->
<div class={`contextual-help ${className}`} {...restProps}>
    <button
        class="contextual-help-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={panelId}
        {onclick}
    >?</button>
    <div
        class="contextual-help-panel"
        id={panelId}
        role="dialog"
        hidden={!expanded}
    >
        {#if children}
            {@render children?.()}
        {/if}
    </div>
</div>
