<script lang="ts">
    // AccordionListItem component
    //
    // A single expandable section within an AccordionList, using the native
    // HTML <details> element for built-in disclosure behavior. The consumer
    // provides a <summary> element (the clickable header) and content (the
    // expandable body) as children. The open prop is two-way bindable via
    // $bindable(), allowing parent components to programmatically control
    // and observe the expanded state.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   open — boolean, default false, bindable. Whether the item is expanded.
    //   children — Snippet, required. A <summary> and content elements.
    //   ...restProps — additional HTML attributes spread onto <details>.
    //
    // Syntax:
    //   <AccordionListItem>
    //     <summary>Header</summary>
    //     <p>Content</p>
    //   </AccordionListItem>
    //
    // Examples:
    //   <!-- Basic accordion item -->
    //   <AccordionListItem>
    //     <summary>What is Svelte?</summary>
    //     <p>A compiler-based UI framework.</p>
    //   </AccordionListItem>
    //
    //   <!-- Pre-expanded with binding -->
    //   <AccordionListItem bind:open={isOpen}>
    //     <summary>Details</summary>
    //     <p>Expanded content.</p>
    //   </AccordionListItem>
    //
    // Keyboard:
    //   - Tab: Focus the summary element
    //   - Enter / Space: Toggle open/close (browser native behavior)
    //
    // Accessibility:
    //   - Native <details> provides implicit disclosure widget semantics
    //   - Browser automatically manages expanded/collapsed state announcement
    //
    // Internationalization:
    //   - No hardcoded text; all content comes through children
    //
    // Claude rules:
    //   - Compound component — use inside AccordionList
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Do not replace native <details> with custom ARIA widgets
    //   - The open prop must use $bindable() for two-way binding
    //
    // References:
    //   - HTML details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        open = $bindable(false),
        children,
        ...restProps
    }: {
        /** Whether expanded. Bindable. */
        open?: boolean;
        /** A <summary> and content elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AccordionListItem.svelte -->
<details
    class={`accordion-list-item ${className}`}
    bind:open
    {...restProps}
>
    {@render children?.()}
</details>
