<script lang="ts">
    // TaskBarButton component
    //
    // A single button item within a TaskBar. Renders as a native <button> element
    // with type="button" for proper keyboard and screen reader support. The
    // component avoids unintended form submissions and supports the disabled
    // attribute for disabling interaction. Content is provided through the
    // children snippet.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   children — Snippet, required. Button content.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <TaskBarButton>New Task</TaskBarButton>
    //
    // Examples:
    //   <!-- Disabled task bar item -->
    //   <TaskBarButton disabled>Delete</TaskBarButton>
    //
    // Keyboard:
    //   - Tab: focus the button
    //   - Enter/Space: activate the button (native behavior)
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
    //   - Designed to be placed inside a TaskBar container
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

<!-- TaskBarButton.svelte -->
<button
    class={`task-bar-button ${className}`}
    type="button"
    {disabled}
    {...restProps}
>
    {@render children?.()}
</button>
