<script lang="ts">
    // GrailLayoutCenterMain component
    //
    // A headless container for the center main content section of a GrailLayout. It
    // holds the primary page content and is flanked by the left and right sidebars.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. Content to render inside the center main section.
    //   ...restProps — additional HTML attributes spread onto the <main>.
    //
    // Syntax:
    //   <GrailLayoutCenterMain>{children}</GrailLayoutCenterMain>
    //
    // Examples:
    //   <GrailLayoutCenterMain><main>Primary content</main></GrailLayoutCenterMain>
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

<!-- GrailLayoutCenterMain.svelte -->
<main class={`grail-layout-center-main ${className}`} {...restProps}>
    {@render children?.()}
</main>
