<script lang="ts">
    // AccordionList component
    //
    // AccordionList elements within an AccordionNav. Provides an optional
    // accessible label for the list.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name for the group via aria-label.
    //   children — Snippet, required. AccordionListItem elements.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Note: Renders a <div> (not <ol>) because AccordionListItem renders <details>,
    // and <details> is not a valid child of <ol>/<ul>.
    //
    // Syntax:
    //   <AccordionNav>
    //     <AccordionList>
    //       <AccordionListItem>...</AccordionListItem>
    //     </AccordionList>
    //   </AccordionNav>
    //
    // Examples:
    //   <AccordionNav label="My Nav">
    //     <AccordionList label="Questions">
    //       <AccordionListItem>
    //         <summary>What is this?</summary>
    //         <p>A design system.</p>
    //       </AccordionListItem>
    //     </AccordionList>
    //  </AccordionNav>
    //
    // Keyboard: None — passive container. Keyboard interactions are handled
    // by AccordionListItem children.
    //
    // Accessibility:
    //   - aria-label optionally provides an accessible name for the group
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded text
    //
    // Claude rules:
    //   - Compound component — used inside AccordionNav, contains AccordionListItem children
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = "",
        children,
        ...restProps
    }: {
        /** Optional accessible label for the group. */
        label?: string;
        /** AccordionListItem elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AccordionList.svelte -->
<div
    class={`accordion-list ${className}`}
    role="group"
    aria-label={label || undefined}
    {...restProps}
>
    {@render children?.()}
</div>
