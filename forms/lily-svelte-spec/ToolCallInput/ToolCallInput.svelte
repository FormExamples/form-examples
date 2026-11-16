<script lang="ts">
    // ToolCallInput component
    //
    // The input or arguments passed to a tool in a ToolCall. Renders a <div> with the `tool-call-input`
    // hook; with a `label` it becomes a named group, without one it has no role.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name; when given, role="group" and aria-label are rendered, otherwise neither.
    //   children — Snippet, optional. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <ToolCallInput label="…">…</ToolCallInput>
    //
    // Examples:
    //   <ToolCall status="done" open><ToolCallInput label="…"><pre>…</pre></ToolCallInput></ToolCall>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - role="group" and aria-label appear only when `label` is given
    //   - The content is usually a <pre> or a description list of arguments
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - A part of ToolCall; draws nothing and carries no strings of its own
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
        /** Accessible name of the group. */
        label?: string;
        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ToolCallInput.svelte -->
<div
    class={`tool-call-input ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
