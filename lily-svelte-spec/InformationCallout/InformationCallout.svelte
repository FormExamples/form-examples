<script lang="ts">
    // InformationCallout component
    //
    // A callout container that highlights important information in a semantically distinct
    // region. Renders an <aside> element with role="note" and an accessible label, making
    // the callout content identifiable to assistive technologies as supplementary information.
    // Useful for displaying notices, tips, warnings, beta announcements, or any content that
    // should stand out from the main flow.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the callout via aria-label (e.g., "Note", "Warning", "Tip").
    //   children — Snippet, required. Callout content to display.
    //   ...restProps — additional HTML attributes spread onto the aside element.
    //
    // Syntax:
    //   <InformationCallout label="Note">{children}</InformationCallout>
    //
    // Examples:
    //   <!-- Beta feature notice -->
    //   <InformationCallout label="Note">
    //     <p>This feature is in beta.</p>
    //   </InformationCallout>
    //
    //   <!-- Important warning callout -->
    //   <InformationCallout label="Warning">
    //     <p>Changes cannot be undone after submission.</p>
    //   </InformationCallout>
    //
    // Keyboard:
    //   - None — this is a passive container with no interactive behavior
    //
    // Accessibility:
    //   - role="note" identifies the content as supplementary information
    //   - aria-label provides an accessible name describing the type of callout
    //
    // Internationalization:
    //   - The label prop allows localized accessible names; no hardcoded user-facing strings
    //   - All content comes through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses <aside> with role="note" for semantic supplementary content
    //   - No internal state; purely a structural container
    //
    // References:
    //   - WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
    //   - HTML aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- InformationCallout.svelte -->
<aside
    class={`information-callout ${className}`}
    role="note"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</aside>
