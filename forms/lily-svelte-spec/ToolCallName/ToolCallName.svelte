<script lang="ts">
    // ToolCallName component
    //
    // The name of the tool in a ToolCall, shown in its summary. Renders a <span> with the `tool-call-name`
    // hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, optional. The tool name.
    //   ...restProps — additional HTML attributes spread onto the root <span>.
    //
    // Syntax:
    //   <ToolCallName>…</ToolCallName>
    //
    // Examples:
    //   <ToolCall status="running"><ToolCallName>search_web</ToolCallName></ToolCall>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - No role or ARIA: plain text inside the ToolCall summary
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - A part of ToolCall; draws nothing and carries no strings of its own
    //
    // References:
    //   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ToolCallName.svelte -->
<span
    class={`tool-call-name ${className}`}
    {...restProps}
>
    {@render children?.()}
</span>
