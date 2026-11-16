<script lang="ts">
    // SuperBanner component
    //
    // A banner for the most important site-wide message. Renders a <div> with the `super-banner` hook
    // around the consumer's text.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The banner message.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <SuperBanner label="…">…</SuperBanner>
    //
    // Examples:
    //   <SuperBanner label="Service notice">The service is closed on Monday.</SuperBanner>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - This component does not render role="alert"; pass role="alert" through restProps only for an interruption the user must hear, as the accessibility rules reserve live regions for such content
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SuperBanner.svelte -->
<div
    class={`super-banner ${className}`}
    role="alert"
    aria-live="assertive"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
