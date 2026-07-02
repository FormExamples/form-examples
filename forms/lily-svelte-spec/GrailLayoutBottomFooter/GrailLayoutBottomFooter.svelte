<script lang="ts">
    // GrailLayoutBottomFooter component
    //
    // A headless container for the bottom footer section of a GrailLayout. It spans
    // the full width of the layout and typically contains copyright, links, or
    // site-wide footer content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. Content to render inside the bottom footer section.
    //   ...restProps — additional HTML attributes spread onto the <footer>.
    //
    // Syntax:
    //   <GrailLayoutBottomFooter>{children}</GrailLayoutBottomFooter>
    //
    // Examples:
    //   <GrailLayoutBottomFooter><footer>Site Footer</footer></GrailLayoutBottomFooter>
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

<!-- GrailLayoutBottomFooter.svelte -->
<footer class={`grail-layout-bottom-footer ${className}`} {...restProps}>
    {@render children?.()}
</footer>
