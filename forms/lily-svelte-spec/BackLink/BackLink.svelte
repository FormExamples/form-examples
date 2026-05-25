<script lang="ts">
    // BackLink component
    //
    // A headless navigation link for returning to a previous page or step.
    // Renders as a semantic <a> element with optional aria-label override.
    // Inspired by the GOV.UK back link pattern. Commonly placed at the top of
    // a page to let users return to the previous step in a multi-step flow,
    // or navigate up to a parent page.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   href     — string, required. The URL to navigate back to.
    //   label    — string, optional. Accessible label override via aria-label,
    //              for when visible link text is insufficient for screen readers.
    //   children — Snippet, required. The link content (text or mixed content).
    //   ...restProps — additional HTML attributes spread onto <a>.
    //
    // Syntax:
    //   <BackLink href="/previous">Back</BackLink>
    //
    // Examples:
    //   <!-- Basic back link -->
    //   <BackLink href="/previous-page">Back to previous page</BackLink>
    //
    //   <!-- With accessible label override -->
    //   <BackLink href="/dashboard" label="Return to dashboard">Back</BackLink>
    //
    //   <!-- In a multi-step form -->
    //   <BackLink href="/step-2" data-step="3">Go back</BackLink>
    //
    // Keyboard:
    //   - Tab: Focus the link (native browser behavior)
    //   - Enter: Activate the link (native browser behavior)
    //
    // Accessibility:
    //   - Implicit link role from the <a> element
    //   - aria-label provides screen reader override when visible text is brief
    //   - Place at the top of the page, before the main heading
    //
    // Internationalization:
    //   - Link text comes through children snippet
    //   - Label override comes through label prop
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer adds back arrow icon or visual indicator
    //   - Always require href; do not use <a> without href
    //
    // References:
    //   - GOV.UK back link pattern: https://design-system.service.gov.uk/components/back-link/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        href,
        label = undefined,
        children,
        ...restProps
    }: {
        /** The URL to navigate back to */
        href: string;
        /** Accessible label override for screen readers */
        label?: string;
        /** The link content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- BackLink.svelte -->
<a
    class={`back-link ${className}`}
    {href}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</a>
