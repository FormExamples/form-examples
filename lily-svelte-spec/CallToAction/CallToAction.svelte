<script lang="ts">
    // CallToAction component
    //
    // A headless call-to-action (CTA) component that prompts users to take a
    // specific action. Renders as an <a> element when href is provided (for
    // navigation CTAs like "Sign Up") or a <button> when no href is given (for
    // action CTAs like "Get Started"). This dual-mode approach ensures correct
    // semantic HTML for accessibility and SEO.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   href — string, optional. If provided, renders as a link; otherwise renders as a button.
    //   label — string, optional. Accessible label override via aria-label.
    //   disabled — boolean, default false. Disables the button (button mode only).
    //   onclick — (event: MouseEvent) => void, optional. Click handler (button mode).
    //   children — Snippet, required. The CTA content.
    //   ...restProps — additional HTML attributes spread onto the <a> or <button>.
    //
    // Syntax:
    //   <CallToAction href="/signup">Sign Up Now</CallToAction>
    //
    // Examples:
    //   <!-- Navigation CTA (renders as <a>) -->
    //   <CallToAction href="/signup">Sign Up Now</CallToAction>
    //
    //   <!-- Action CTA (renders as <button>) -->
    //   <CallToAction onclick={handleAction}>Get Started</CallToAction>
    //
    // Keyboard:
    //   - Tab: Focus the element
    //   - Enter: Activate the link or button
    //   - Space: Activate the button (button mode only; links do not respond to Space)
    //
    // Accessibility:
    //   - Implicit link role when rendered as <a>
    //   - Implicit button role when rendered as <button>
    //   - Optional aria-label for screen reader text override
    //   - disabled only applies in button mode (links cannot be disabled natively)
    //
    // Internationalization:
    //   - CTA text comes through children snippet; no hardcoded strings
    //   - Label override comes through label prop
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses <a> for navigation, <button> for actions — never mix semantics
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
    //   - WAI-ARIA Link Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/link/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        href = undefined,
        label = undefined,
        disabled = false,
        onclick = undefined,
        children,
        ...restProps
    }: {
        /** If provided, renders as a link */
        href?: string;
        /** Accessible label override */
        label?: string;
        /** Whether the element is disabled (button mode only) */
        disabled?: boolean;
        /** Click event handler (button mode) */
        onclick?: (event: MouseEvent) => void;
        /** The CTA content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CallToAction.svelte -->
{#if href}
    <a
        class={`call-to-action ${className}`}
        {href}
        aria-label={label}
        {...restProps}
    >
        {@render children?.()}
    </a>
{:else}
    <button
        class={`call-to-action ${className}`}
        type="button"
        {disabled}
        aria-label={label}
        {onclick}
        {...restProps}
    >
        {@render children?.()}
    </button>
{/if}
