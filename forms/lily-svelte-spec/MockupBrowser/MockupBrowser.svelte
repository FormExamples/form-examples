<script lang="ts">
    // MockupBrowser component
    //
    // A browser-window frame around a screenshot or demo. Renders a <div> with the `mockup-browser` hook;
    // the chrome is the consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The framed content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <MockupBrowser label="…">…</MockupBrowser>
    //
    // Examples:
    //   <MockupBrowser>…</MockupBrowser>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - A <div> has no role; pass role="group" through restProps so the label is announced
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

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

<!-- MockupBrowser.svelte -->
<div
    class={`mockup-browser ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
