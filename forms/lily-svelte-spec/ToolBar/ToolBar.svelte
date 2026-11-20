<script lang="ts">
    // ToolBar component
    //
    // A headless toolbar container that provides the ARIA toolbar role and built-in
    // keyboard navigation for action buttons and controls, through the shared
    // attachToolbar (widget-keys): one tab stop that follows focus, arrows that
    // move between enabled controls and wrap, Home and End.
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
    //   - ArrowRight: move focus to next enabled item (wraps to first); ArrowLeft in right-to-left
    //   - ArrowLeft: move focus to previous enabled item (wraps to last); ArrowRight in right-to-left
    //   - ArrowDown / ArrowUp instead, with aria-orientation="vertical"
    //   - A text field, select or textarea in the toolbar keeps its own arrows
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
    //   - Keys come from attachToolbar in widget-keys; the toolbar contract holds every port to it
    //   - Arrow keys wrap around at boundaries
    //
    // References:
    //   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

    import { warnMissingName } from "../dev-warning";
    import { attachToolbar } from "../widget-keys";
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

    $effect(() =>
        warnMissingName("ToolBar", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    let toolbarRef: HTMLElement | undefined = $state(undefined);

    // The shared toolbar keys: one tab stop, arrows that skip a disabled control and swap in right-to-left, Home, End.
    $effect(() => (toolbarRef ? attachToolbar(toolbarRef) : undefined));
</script>

<!-- ToolBar.svelte -->
<div
    class={`tool-bar ${className}`}
    role="toolbar"
    aria-label={label}
    bind:this={toolbarRef}
    {...restProps}
>
    {@render children?.()}
</div>
