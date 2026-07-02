<script lang="ts">
    // ActionLink component
    //
    // A headless action link that renders a semantic <a> element for prominent
    // navigation actions. Inspired by the NHS England action link pattern.
    // Use when you want to draw attention to a key navigational step, such as
    // "Continue to next step", "Find a service near you", or "Start application",
    // distinguishing these from standard inline text links.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   href     — string, required. The URL the link points to.
    //   label    — string, optional. Accessible label override via aria-label
    //              for when visible link text is insufficient for screen readers.
    //   children — Snippet, required. The link content (text or mixed content).
    //   ...restProps — additional HTML anchor attributes spread onto <a>.
    //
    // Syntax:
    //   <ActionLink href="/path">Link text</ActionLink>
    //
    // Examples:
    //   <!-- Basic action link -->
    //   <ActionLink href="/next-step">Continue to next step</ActionLink>
    //
    //   <!-- With accessible label override -->
    //   <ActionLink href="/find" label="Find a GP surgery near you">
    //     Find a GP
    //   </ActionLink>
    //
    //   <!-- With custom attributes -->
    //   <ActionLink href="/apply" data-track="apply-cta">
    //     Start your application
    //   </ActionLink>
    //
    // Keyboard:
    //   - Tab: Focus the link (native browser behavior)
    //   - Enter: Activate the link (native browser behavior)
    //
    // Accessibility:
    //   - Implicit link role from the <a> element
    //   - aria-label provides screen reader override when link text is insufficient
    //   - Ensure link text clearly describes the destination or action
    //
    // Internationalization:
    //   - All text content comes through children snippet and label prop
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Always require href prop; do not use <a> without href
    //   - Do not add icons or visual indicators; consumer provides those
    //
    // References:
    //   - NHS England action link pattern
    //   - WAI-ARIA link role: https://www.w3.org/TR/wai-aria-1.2/#link

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        href,
        label = undefined,
        children,
        ...restProps
    }: {
        /** The URL the link points to */
        href: string;
        /** Accessible label override for screen readers */
        label?: string;
        /** The link content (text, icons, etc.) */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ActionLink.svelte -->
<a
    class={`action-link ${className}`}
    {href}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</a>
