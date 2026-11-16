<script lang="ts">
    // MockupShell component
    //
    // A device frame: a box that looks like a generic device shell. Renders a <div> with the `mockup-
    // shell` hook around the consumer's screenshot or demo; the device drawing is the consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The framed content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <MockupShell label="…">…</MockupShell>
    //
    // Examples:
    //   <MockupShell label="…"><img src="screen.png" alt="…" /></MockupShell>
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

<!-- MockupShell.svelte -->
<div
    class={`mockup-shell ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
