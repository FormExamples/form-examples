<script lang="ts">
    // Panel component
    //
    // A headless labeled container for grouping related content, controls, or settings.
    // It renders a semantic <section> element with an accessible label, creating a
    // named region landmark that assistive technology can identify and navigate to.
    // Commonly used in dashboards, settings pages, sidebars, and multi-section layouts.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the panel region via aria-label.
    //   children — Snippet, required. The panel content.
    //   ...restProps — additional HTML attributes spread onto the <section>.
    //
    // Syntax:
    //   <Panel label="Settings">{children}</Panel>
    //
    // Examples:
    //   <!-- Basic labeled panel -->
    //   <Panel label="Settings">
    //     <p>Adjust your preferences below.</p>
    //   </Panel>
    //
    //   <!-- Multiple panels on a page -->
    //   <Panel label="Account information">
    //     <p>Name, email, and profile details.</p>
    //   </Panel>
    //   <Panel label="Notification preferences">
    //     <p>Choose how you want to be notified.</p>
    //   </Panel>
    //
    // Keyboard:
    //   None — this is a passive container. Screen reader users can navigate to
    //   named regions using landmark navigation shortcuts.
    //
    // Accessibility:
    //   - <section aria-label="..."> creates a named region landmark
    //   - Assistive technology can list and navigate to this section via landmarks
    //   - The aria-label value should be concise and descriptive of the panel content
    //
    // Internationalization:
    //   - The label prop is the only text; consumer provides all content through children
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses <section> not <div> for proper landmark semantics
    //   - Do not add headings — consumer provides heading elements as needed
    //
    // References:
    //   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
    //   - HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
    //   - WAI Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

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

<!-- Panel.svelte -->
<section
    class={`panel ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</section>
