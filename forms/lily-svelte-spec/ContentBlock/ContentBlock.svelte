<script lang="ts">
    // ContentBlock component
    //
    // A width-constrained column for editorial content. Sets `data-width` to the chosen width token; the
    // pixel values behind each token are the consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   width — "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid", default "normal". Rendered as data-width.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <ContentBlock width="wide">…</ContentBlock>
    //
    // Examples:
    //   <ContentBlock><BodyText><p>Text</p></BodyText></ContentBlock>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - No role or ARIA: a layout wrapper
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Width is a data attribute, never an inline style; map each token in CSS with `[data-width="wide"]`
    //
    // References:
    //   - Reuters Graphics ContentBlock (the inspiration): https://github.com/reuters-graphics/graphics-components

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        width = "normal",
        children,
        ...restProps
    }: {
        width?: "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid";
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ContentBlock.svelte -->
<div
    class={`content-block ${className}`}
    data-width={width}
    {...restProps}
>
    {@render children?.()}
</div>
