<script lang="ts">
    // DoListItem component
    //
    // A single recommended-practice item within a "Do" list. Renders a semantic
    // <li> element representing a guideline or best practice that users should
    // follow. Commonly used in design system documentation, style guides, and
    // instructional content to show approved patterns alongside DontListItem.
    //
    // The component sets data-recommendation="do" for consumer styling hooks,
    // enabling visual differentiation (e.g. green checkmarks, success borders)
    // without embedding any styles itself.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. The recommendation content.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <DoListItem>Use semantic HTML elements</DoListItem>
    //
    // Examples:
    //   <!-- Design system guideline list -->
    //   <ul aria-label="Recommended practices">
    //     <DoListItem>Use descriptive alt text for images</DoListItem>
    //     <DoListItem>Provide visible focus indicators</DoListItem>
    //     <DoListItem>Use sufficient color contrast</DoListItem>
    //   </ul>
    //
    //   <!-- Side-by-side do/don't pattern -->
    //   <ul aria-label="Do">
    //     <DoListItem>Write clear error messages</DoListItem>
    //   </ul>
    //   <ul aria-label="Don't">
    //     <DontListItem>Use technical jargon in errors</DontListItem>
    //   </ul>
    //
    // Keyboard:
    //   - None directly — passive informational display, not interactive
    //
    // Accessibility:
    //   - Semantic <li> element provides list item semantics within the parent list
    //   - Screen readers announce list position from the parent <ul> or <ol>
    //   - data-recommendation attribute provides a hook for consumer styling
    //
    // Internationalization:
    //   - All content is provided through the children snippet
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Should be placed inside a <ul> or <ol> for valid HTML
    //   - Consumer can target [data-recommendation="do"] for visual styling
    //
    // References:
    //   - MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
    //   - Material Design Do/Don't guidelines: https://m3.material.io/foundations/content-design/style-guide/overview

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** The recommendation content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DoListItem.svelte -->
<li
    class={`do-list-item ${className}`}
    data-recommendation="do"
    {...restProps}
>
    {@render children?.()}
</li>
