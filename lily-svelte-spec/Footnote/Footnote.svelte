<script lang="ts">
    // Footnote component
    //
    // A footnote provides supplementary information, citations, or clarifications that
    // support the main content without cluttering it. Commonly used in articles, academic
    // writing, legal documents, and documentation. Renders as a semantic <aside> element
    // with role="note", and each footnote is identified by a unique id for in-page linking.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   id — string, required. Unique footnote identifier, used for element id and aria-label.
    //   children — Snippet, required. Footnote content (text, links, citations).
    //   ...restProps — additional HTML attributes spread onto the aside element.
    //
    // Syntax:
    //   <Footnote id="fn1">Source: Example et al., 2024</Footnote>
    //
    // Examples:
    //   <!-- Simple citation footnote -->
    //   <Footnote id="fn1">Source: Example et al., 2024</Footnote>
    //
    //   <!-- In-page link from main content to footnote -->
    //   <p>This claim is supported by research.<a href="#fn1"><sup>1</sup></a></p>
    //   <Footnote id="fn1">
    //     <a href="#ref1">1.</a> Example, A. (2024). Research Title. Journal Name.
    //   </Footnote>
    //
    // Keyboard:
    //   - None — this is a passive container; keyboard navigation handled by interactive child elements
    //
    // Accessibility:
    //   - role="note" indicates supplementary content related to the main content
    //   - aria-label provides an accessible name derived from the footnote identifier
    //   - The id attribute enables in-page linking from superscript reference markers
    //
    // Internationalization:
    //   - All content comes through the children snippet; no hardcoded user-facing strings
    //   - The id prop is used as the aria-label; consumers should use meaningful identifiers
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses <aside> with role="note" for semantic supplementary content
    //   - Consumer is responsible for creating in-page links to the footnote
    //
    // References:
    //   - WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
    //   - MDN aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        id,
        children,
        ...restProps
    }: {
        /** Unique footnote identifier. */
        id: string;
        /** Footnote content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Footnote.svelte -->
<aside
    class={`footnote ${className}`}
    {id}
    role="note"
    aria-label={id}
    {...restProps}
>
    {@render children?.()}
</aside>
