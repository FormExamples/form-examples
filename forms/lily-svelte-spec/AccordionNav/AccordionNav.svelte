<script lang="ts">
    // AccordionNav component
    //
    // A headless navigation container for an accordion, rendered as a <nav>
    // element with an accessible label. Serves as the outermost wrapper for
    // collapsible accordion content. Contains an AccordionList which holds
    // AccordionListItem children. Commonly used for FAQs, settings panels,
    // filter groups, and mobile navigation menus.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   children — Snippet, required. AccordionList element.
    //   ...restProps — additional HTML attributes spread onto the <nav>.
    //
    // Syntax:
    //   <AccordionNav label="FAQ">
    //     <AccordionList>...</AccordionList>
    //   </AccordionNav>
    //
    // Examples:
    //   <!-- FAQ accordion -->
    //   <AccordionNav label="Frequently Asked Questions">
    //     <AccordionList>
    //       <AccordionListItem>
    //         <summary>What is this?</summary>
    //         <p>A design system.</p>
    //       </AccordionListItem>
    //     </AccordionList>
    //   </AccordionNav>
    //
    // Keyboard: None — this is a passive container. Keyboard interactions
    // are handled by AccordionListItem children (Enter/Space to toggle).
    //
    // Accessibility:
    //   - <nav> element provides navigation landmark semantics
    //   - aria-label provides the accessible name for screen readers
    //
    // Internationalization:
    //   - The label prop is the only user-facing string
    //   - No hardcoded text; all content comes through props and children
    //
    // Claude rules:
    //   - Compound component — use with AccordionList and AccordionListItem
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
    //   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** AccordionList element. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AccordionNav.svelte -->
<nav
    class={`accordion-nav ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</nav>
