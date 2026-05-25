<script lang="ts">
    // GrailLayoutLeftAside component
    //
    // A headless container for the left aside section of a GrailLayout. It
    // typically contains navigation menus, filters, or supplementary content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. Content to render inside the left aside.
    //   ...restProps — additional HTML attributes spread onto the <aside>.
    //
    // Syntax:
    //   <GrailLayoutLeftAside>{children}</GrailLayoutLeftAside>
    //
    // Examples:
    //   <GrailLayoutLeftAside><nav>Navigation menu</nav></GrailLayoutLeftAside>
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

<!-- GrailLayoutLeftAside.svelte -->
<aside class={`grail-layout-left-aside ${className}`} {...restProps}>
    {@render children?.()}
</aside>
