<script lang="ts">
    // CodeBlock component
    //
    // A block of preformatted code. Renders a <pre> with the `code-block` hook; whitespace is preserved by
    // the element. Syntax highlighting is the consumer's.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Names the block, which becomes role="region".
    //   children — Snippet, required. The code text (usually a <code> element inside).
    //   ...restProps — additional HTML attributes spread onto the root <pre>.
    //
    // Syntax:
    //   <CodeBlock label="…">…</CodeBlock>
    //
    // Examples:
    //   <CodeBlock label="Install"><code>pnpm install</code></CodeBlock>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - role="region" and aria-label come from `label` when given
    //   - A scrollable <pre> should be keyboard-focusable (tabindex="0") with an accessible name; pass both through restProps
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <pre>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre

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

<!-- CodeBlock.svelte -->
<pre
    class={`code-block ${className}`}
    role={label ? "region" : undefined}
    aria-label={label}
    {...restProps}>
    {@render children?.()}
</pre>
