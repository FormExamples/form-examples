<script lang="ts">
    // Mark component
    //
    // An inline highlight marking text as relevant or referenced, such as a search match. Renders the
    // native <mark> element with the `mark` hook; the highlight colour is the consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, optional. The marked text.
    //   ...restProps — additional HTML attributes spread onto the root <mark>.
    //
    // Syntax:
    //   <Mark>…</Mark>
    //
    // Examples:
    //   <p>Search results for <Mark>design</Mark> systems.</p>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - The native <mark> element conveys relevance; screen readers do not announce it consistently, so do not rely on the highlight alone
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Draws nothing and carries no strings of its own
    //
    // References:
    //   - MDN <mark>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Mark.svelte -->
<mark
    class={`mark ${className}`}
    {...restProps}
>
    {@render children?.()}
</mark>
