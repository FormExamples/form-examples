<script lang="ts">
    // GrailLayout component
    //
    // A headless container that provides the classic "holy grail" web design structure
    // with five sections: a full-width top header, a left sidebar, a center content
    // area, a right sidebar, and a full-width bottom footer. Renders a <div> with no
    // layout styles, allowing consumers to apply CSS Grid, Flexbox, or any layout system.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. Layout section elements to render.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <GrailLayout>{children}</GrailLayout>
    //
    // Examples:
    //   <GrailLayout>
    //     <GrailLayoutTop>Header</GrailLayoutTop>
    //     <GrailLayoutLeft>Left sidebar</GrailLayoutLeft>
    //     <GrailLayoutCenter>Main content</GrailLayoutCenter>
    //     <GrailLayoutRight>Right sidebar</GrailLayoutRight>
    //     <GrailLayoutBottom>Footer</GrailLayoutBottom>
    //   </GrailLayout>
    //
    // Keyboard:
    //   - None. Structural layout component with no interactive behavior.
    //
    // Accessibility:
    //   - No explicit ARIA attributes; consumers use semantic landmarks within sections
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No layout styles applied; consumer provides CSS Grid or Flexbox
    //
    // References:
    //   - CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** Layout section elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GrailLayout.svelte -->
<div
    class={`grail-layout ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
