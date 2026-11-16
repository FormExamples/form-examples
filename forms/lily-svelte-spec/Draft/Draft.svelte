<script lang="ts">
    // Draft component
    //
    // A wrapper that marks content as a draft. Renders a <div> with the `draft` hook; `status` is exposed
    // as data-status for the consumer's CSS (for example to show a watermark).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   status — string, optional. Rendered as data-status; the vocabulary (for example "draft", "review") is the consumer's.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Draft label="…" status="draft">…</Draft>
    //
    // Examples:
    //   <Draft label="Draft policy" status="draft"><p>Text under review.</p></Draft>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - Do not rely on the CSS watermark alone to say the content is a draft (WCAG 1.4.1), include visible text
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - `status` is a data attribute for the consumer, not an ARIA state
    //
    // References:
    //   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        status = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        status?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Draft.svelte -->
<div
    class={`draft ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    data-status={status}
    {...restProps}
>
    {@render children?.()}
</div>
