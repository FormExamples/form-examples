<script lang="ts">
    // MockupTabletLandscape component
    //
    // A device frame: a box that looks like a tablet in landscape orientation. Renders a <div> with the
    // `mockup-tablet-landscape` hook around the consumer's screenshot or demo; the device drawing is the
    // consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The framed content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <MockupTabletLandscape label="…">…</MockupTabletLandscape>
    //
    // Examples:
    //   <MockupTabletLandscape label="…"><img src="screen.png" alt="…" /></MockupTabletLandscape>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - A <div> has no role; pass role="img" or "group" through restProps, and a text alternative, if the mockup must be announced
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

<!-- MockupTabletLandscape.svelte -->
<div
    class={`mockup-tablet-landscape ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
