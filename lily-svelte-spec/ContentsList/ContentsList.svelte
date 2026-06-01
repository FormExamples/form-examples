<script lang="ts">
    // ContentsList component
    //
    // A headless ordered list for a table of contents. Renders a semantic <ol>
    // element containing ContentsListItem children. Designed to be placed inside
    // a ContentsNav component. The ordered list conveys the sequential nature of
    // page sections to assistive technology.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. ContentsListItem components or <li> elements.
    //   ...restProps — additional HTML attributes spread onto the <ol>.
    //
    // Syntax:
    //   <ContentsList>
    //     <ContentsListItem><a href="#section">Section</a></ContentsListItem>
    //   </ContentsList>
    //
    // Examples:
    //   <!-- Contents list inside a navigation landmark -->
    //   <ContentsNav label="On this page">
    //     <ContentsList>
    //       <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
    //       <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
    //     </ContentsList>
    //   </ContentsNav>
    //
    // Keyboard:
    //   - None — passive list container; keyboard navigation handled by links within items
    //
    // Accessibility:
    //   - <ol> provides implicit list role conveying sequential section order
    //
    // Internationalization:
    //   - All content is provided by consumers through children; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: used inside ContentsNav, contains ContentsListItem children
    //
    // References:
    //   - MDN ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: { children: Snippet; [key: string]: unknown } = $props();
</script>

<!-- ContentsList.svelte -->
<ol
    class={`contents-list ${className}`}
    {...restProps}
>
    {@render children?.()}
</ol>
