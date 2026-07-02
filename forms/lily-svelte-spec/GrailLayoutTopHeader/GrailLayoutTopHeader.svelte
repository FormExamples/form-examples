<script lang="ts">
    // GrailLayoutTopHeader component
    //
    // A headless container for the top header section of a GrailLayout. It spans
    // the full width of the layout and typically contains site branding, navigation,
    // or a top bar.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. Content to render inside the top header section.
    //   ...restProps — additional HTML attributes spread onto the <header>.
    //
    // Syntax:
    //   <GrailLayoutTopHeader>{children}</GrailLayoutTopHeader>
    //
    // Examples:
    //   <GrailLayoutTopHeader><header>Site Header</header></GrailLayoutTopHeader>
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

<!-- GrailLayoutTopHeader.svelte -->
<header class={`grail-layout-top-header ${className}`} {...restProps}>
    {@render children?.()}
</header>
