<script lang="ts">
    // Thinking component
    //
    // A headless disclosure for an AI assistant's reasoning / "thinking" trace,
    // built on the native <details>. Closed by default. While `streaming` the root
    // carries data-streaming and aria-busy so consumer CSS/AT know it is still filling.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. The summary text. No default.
    //   open — boolean, default false. Bindable.
    //   streaming — boolean, default false. Adds data-streaming="true" + aria-busy="true" when true.
    //   children — Snippet. The reasoning content.
    //   ...restProps — additional HTML attributes spread onto the root <details>.
    //
    // Keyboard:
    //   - Enter / Space on the native <summary> toggles
    //
    // Accessibility:
    //   - Native details/summary semantics; aria-busy only while streaming
    //
    // Claude rules:
    //   - Headless: no CSS, no animation, no hardcoded strings
    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        open = $bindable(false),
        streaming = false,
        children,
        ...restProps
    }: {
        /** Summary text. */
        label: string;
        /** Whether open. Bindable. */
        open?: boolean;
        /** Whether content is still being produced. */
        streaming?: boolean;
        /** Reasoning content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Thinking", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );
</script>

<!-- Thinking.svelte -->
<details
    class={`thinking ${className}`}
    bind:open
    data-streaming={streaming ? "true" : undefined}
    aria-busy={streaming ? "true" : undefined}
    {...restProps}
>
    <summary class="thinking-summary">{label}</summary>
    <div class="thinking-content">
        {@render children?.()}
    </div>
</details>
