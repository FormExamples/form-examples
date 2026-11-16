<script lang="ts">
    // ToolCallStatus component
    //
    // The status of a tool call as a word (pending, running, done or error), shown in the ToolCall
    // summary. Renders a <span> with the `tool-call-status` hook; `status` is exposed as data-status for
    // the consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   status — string, optional. Rendered as data-status, for example pending, running, done or error.
    //   children — Snippet, optional. The visible status word.
    //   ...restProps — additional HTML attributes spread onto the root <span>.
    //
    // Syntax:
    //   <ToolCallStatus status="running">…</ToolCallStatus>
    //
    // Examples:
    //   <ToolCallStatus status="running">Running</ToolCallStatus>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - The visible word carries the meaning; never show the status by colour alone (WCAG 1.4.1)
    //   - No role or live region of its own
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - A part of ToolCall; carries no strings of its own
    //   - data-status is for the consumer's CSS, not an ARIA state
    //
    // References:
    //   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        status = undefined,
        children,
        ...restProps
    }: {
        /** Status: pending, running, done or error. */
        status?: string;
        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ToolCallStatus.svelte -->
<span
    class={`tool-call-status ${className}`}
    data-status={status}
    {...restProps}
>
    {@render children?.()}
</span>
