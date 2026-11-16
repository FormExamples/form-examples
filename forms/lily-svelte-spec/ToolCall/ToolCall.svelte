<script lang="ts">
    // ToolCall component
    //
    // A headless disclosure for one tool invocation, built on the native <details>. Closed by default. The `summary` content (typically ToolCallName and ToolCallStatus) goes inside <summary class="tool-call-summary">; the body (ToolCallInput, ToolCallOutput, ToolCallError) goes inside <div class="tool-call-content">. `status` (pending | running | done | error) sets data-status on the root, and aria-busy="true" only while running. The component never animates, times or opens itself: the consumer owns `open` (open it on error so ToolCallError is not hidden) and any spinner/animation CSS.
    //
    // Props:
    //   class — string, optional. CSS class name.
    //   status — string, optional. pending | running | done | error. No default.
    //   open — boolean, default false. Bindable.
    //   summary — Snippet. The summary content (name + status words).
    //   children — Snippet. The body.
    //   ...restProps — additional HTML attributes spread onto the root <details>.
    //
    // Keyboard: Enter / Space on the native <summary> toggles.
    //
    // Claude rules:
    //   - Headless: no CSS, no animation, no hardcoded strings
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        status = undefined,
        open = $bindable(false),
        summary,
        children,
        ...restProps
    }: {
        /** pending | running | done | error. */
        status?: string;
        /** Whether open. Bindable. */
        open?: boolean;
        /** Summary content. */
        summary?: Snippet;
        /** Body content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ToolCall.svelte -->
<details
    class={`tool-call ${className}`}
    bind:open
    data-status={status}
    aria-busy={status === "running" ? "true" : undefined}
    {...restProps}
>
    <summary class="tool-call-summary">
        {@render summary?.()}
    </summary>
    <div class="tool-call-content">
        {@render children?.()}
    </div>
</details>
