<script lang="ts">
    // GrailLayoutRightAside component
    //
    // A headless container for the right aside section of a GrailLayout. It
    // typically contains supplementary content, ads, related links, or contextual
    // information.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. Content to render inside the right aside.
    //   ...restProps — additional HTML attributes spread onto the <aside>.
    //
    // Syntax:
    //   <GrailLayoutRightAside>{children}</GrailLayoutRightAside>
    //
    // Examples:
    //   <GrailLayoutRightAside><aside>Supplementary content</aside></GrailLayoutRightAside>
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GrailLayoutRightAside.svelte -->
<aside class={`grail-layout-right-aside ${className}`} {...restProps}>
    {@render children?.()}
</aside>
