<script lang="ts">
    // InsetText component
    //
    // An inset text block used to distinguish content from the surrounding text, drawing
    // attention to important information that a user needs to know. Commonly used in
    // government and institutional design systems to highlight supplementary information,
    // processing times, eligibility criteria, or important notices. Renders a <div> with
    // role="note" for semantic supplementary content indication.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. Content to display inside the inset text block.
    //   ...restProps — additional HTML attributes spread onto the container div.
    //
    // Syntax:
    //   <InsetText>It can take up to 8 weeks to process.</InsetText>
    //
    // Examples:
    //   <!-- Simple inset text notice -->
    //   <InsetText>It can take up to 8 weeks to process.</InsetText>
    //
    //   <!-- Inset text with structured content -->
    //   <InsetText>
    //     <p>You must apply before the deadline. Late applications will not be accepted.</p>
    //   </InsetText>
    //
    // Keyboard:
    //   - None — this is a passive container with no interactive behavior
    //
    // Accessibility:
    //   - role="note" identifies the content as supplementary information
    //   - Screen readers announce it with appropriate context as a note
    //
    // Internationalization:
    //   - All content comes through the children snippet; no hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling (e.g., border-left, indentation)
    //   - No internal state; purely a presentational container
    //   - Inspired by GOV.UK and NHS England "inset text" pattern
    //
    // References:
    //   - WAI-ARIA Note Role: https://www.w3.org/TR/wai-aria-1.2/#note
    //   - GOV.UK Inset Text: https://design-system.service.gov.uk/components/inset-text/
    //   - NHS England Inset Text: https://service-manual.nhs.uk/design-system/components/inset-text

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

<!-- InsetText.svelte -->
<div
    class={`inset-text ${className}`}
    role="note"
    {...restProps}
>
    {@render children?.()}
</div>
