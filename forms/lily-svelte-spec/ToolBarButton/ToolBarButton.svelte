<script lang="ts">
    // ToolBarButton component
    //
    // A single button within a ToolBar. Renders as a native <button> element
    // with type="button" for proper keyboard and screen reader support. The
    // component avoids unintended form submissions and supports the disabled
    // attribute for disabling interaction. Designed to be placed inside a ToolBar
    // container that manages roving focus keyboard navigation.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   children — Snippet, required. Button content.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <ToolBarButton>Bold</ToolBarButton>
    //
    // Examples:
    //   <!-- Toolbar with buttons -->
    //   <ToolBar label="Editor tools">
    //     <ToolBarButton>Bold</ToolBarButton>
    //     <ToolBarButton>Italic</ToolBarButton>
    //     <ToolBarButton disabled>Redo</ToolBarButton>
    //   </ToolBar>
    //
    // Keyboard:
    //   - Enter/Space: activate the button (native behavior)
    //   - Arrow keys: handled by parent ToolBar for roving focus navigation
    //   - Button is skipped in tab order when disabled
    //
    // Accessibility:
    //   - Implicit button role from the <button> element
    //   - disabled attribute communicates disabled state to assistive technology
    //
    // Internationalization:
    //   - All text is provided through the children snippet
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Compound component: must be used inside a ToolBar container
    //   - type="button" prevents accidental form submission
    //
    // References:
    //   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        disabled = false,
        children,
        ...restProps
    }: {
        /** Whether disabled. */
        disabled?: boolean;
        /** Button content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ToolBarButton.svelte -->
<button
    class={`tool-bar-button ${className}`}
    type="button"
    {disabled}
    {...restProps}
>
    {@render children?.()}
</button>
