<script lang="ts">
    // SectionLink component
    //
    // A link to a section of the page. Renders an <a> with the `section-link` hook; `href` defaults to
    // #top, so pass the real section anchor.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accepted but not rendered; the link's name is its children.
    //   href — string, default "#top". The link target.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <a>.
    //
    // Syntax:
    //   <SectionLink href="#section">…</SectionLink>
    //
    // Examples:
    //   <SectionLink href="#methods">Methods</SectionLink>
    //
    // Keyboard:
    //   - Tab: moves focus onto the link
    //   - Enter: follows the link (native browser behaviour)
    //
    // Accessibility:
    //   - A native <a href>; the children are the accessible name
    //   - `label` is not rendered, so put the text in the children
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        href = "#top",
        children,
        ...restProps
    }: {
        label?: string;
        href?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SectionLink.svelte -->
<a
    class={`section-link ${className}`}
    {href}
    {...restProps}
>
    {@render children?.()}
</a>
