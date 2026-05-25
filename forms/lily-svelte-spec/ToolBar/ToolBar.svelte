<script lang="ts">
    // ToolBar component
    //
    // A headless toolbar container that provides the ARIA toolbar role and built-in
    // keyboard navigation for action buttons and controls. It implements the roving
    // focus pattern with Left/Right arrow keys to move between items and Home/End
    // keys to jump to first/last items. Focus wraps around from last to first and
    // vice versa.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the toolbar via aria-label.
    //   children — Snippet, required. ToolBarButton elements.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ToolBar label="Editor tools">...</ToolBar>
    //
    // Examples:
    //   <!-- Text editor toolbar -->
    //   <ToolBar label="Editor tools">
    //     <ToolBarButton>Bold</ToolBarButton>
    //     <ToolBarButton>Italic</ToolBarButton>
    //     <ToolBarButton>Underline</ToolBarButton>
    //   </ToolBar>
    //
    // Keyboard:
    //   - ArrowRight: move focus to next item (wraps to first)
    //   - ArrowLeft: move focus to previous item (wraps to last)
    //   - Home: move focus to first item
    //   - End: move focus to last item
    //   - Tab: enter/exit the toolbar
    //
    // Accessibility:
    //   - role="toolbar" identifies the container as a toolbar widget
    //   - aria-label provides the accessible name for the toolbar
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Compound component: use with ToolBarButton
    //   - Uses horizontal (ArrowLeft/ArrowRight) navigation
    //   - Arrow keys wrap around at boundaries
    //
    // References:
    //   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** ToolBarButton elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let toolbarRef: HTMLElement | undefined = $state(undefined);

    function onkeydown(event: KeyboardEvent) {
        if (!toolbarRef) return;
        const items = Array.from(
            toolbarRef.querySelectorAll<HTMLElement>(
                "button, [role='button'], [tabindex]",
            ),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowLeft": {
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
        }
    }
</script>

<!-- ToolBar.svelte -->
<div
    class={`tool-bar ${className}`}
    role="toolbar"
    aria-label={label}
    bind:this={toolbarRef}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</div>
