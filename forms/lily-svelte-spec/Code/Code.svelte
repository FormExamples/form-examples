<script lang="ts">
    // Code component
    //
    // Inline computer code. Renders a <code> with the `code` hook; use CodeBlock for multi-line code.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. The code text.
    //   ...restProps — additional HTML attributes spread onto the root <code>.
    //
    // Syntax:
    //   <Code>…</Code>
    //
    // Examples:
    //   <p>Run <Code>pnpm install</Code> first.</p>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <code>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Code.svelte -->
<code
    class={`code ${className}`}
    {...restProps}
>
    {@render children?.()}
</code>
