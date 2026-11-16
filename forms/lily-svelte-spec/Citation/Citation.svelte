<script lang="ts">
    // Citation component
    //
    // Marks the title of a cited work or the name of a source. Renders a <cite> with the `citation` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text read before the citation.
    //   children — Snippet, required. The cited title or source name.
    //   ...restProps — additional HTML attributes spread onto the root <cite>.
    //
    // Syntax:
    //   <Citation label="…">…</Citation>
    //
    // Examples:
    //   <Citation>The Design of Everyday Things</Citation>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - hidden text comes from `label` when given
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <cite>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite

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

<!-- Citation.svelte -->
<cite
    class={`citation ${className}`}
    {...restProps}
>
    {#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{@render children?.()}
</cite>
