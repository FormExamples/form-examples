<script lang="ts">
    // ActionBarButton component
    //
    // One action button inside an action bar. Renders a native `<button>`
    // with a required accessible label. Children render the visible content
    // (icon and/or text).
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the button.
    //   type — "button" | "submit" | "reset", default "button".
    //   disabled — boolean, default false.
    //   onclick — (event: MouseEvent) => void, optional.
    //   children — Snippet, optional. Button content.
    //
    // Syntax:
    //   <ActionBarButton label="Delete" onclick={handleDelete}>Delete</ActionBarButton>
    //
    // Keyboard:
    //   - Tab: focus
    //   - Enter / Space: activate
    //
    // Accessibility:
    //   - aria-label is required so icon-only buttons remain accessible
    //
    // Internationalization:
    //   - Label and content come through props
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        type = "button",
        disabled = false,
        onclick = undefined,
        children = undefined,
        ...restProps
    }: {
        class?: string;
        /** Accessible label (REQUIRED) */
        label: string;
        /** HTML button type */
        type?: "button" | "submit" | "reset";
        /** Whether the button is disabled */
        disabled?: boolean;
        /** Click handler */
        onclick?: (event: MouseEvent) => void;
        /** Button content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ActionBarButton.svelte -->
<button
    class={`action-bar-button ${className}`}
    {type}
    {disabled}
    aria-label={label}
    {onclick}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</button>
