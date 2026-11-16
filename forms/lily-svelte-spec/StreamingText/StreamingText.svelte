<script lang="ts">
    // StreamingText component
    //
    // A polite live region for text that grows over time. While `streaming` is true the region is marked busy (`aria-busy="true"`, `data-streaming="true"`) so assistive technology waits instead of announcing every chunk; when it flips to false the finished text is announced once (`role="status"`, `aria-live="polite"`, `aria-atomic="true"`). The component never splits, times, reveals or animates the text: the consumer appends chunks to the children, and owns any caret or reduced-motion CSS.
    //
    // Props:
    //   class — string, optional. CSS class name.
    //   label — string, optional. Accessible name of the status region.
    //   streaming — boolean, default false. True while chunks are still arriving.
    //   children — Snippet. The text so far.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Keyboard: none.
    //
    // Claude rules:
    //   - Headless: no CSS, no animation, no timing, no hardcoded strings
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        streaming = false,
        children,
        ...restProps
    }: {
        /** Accessible name of the region. */
        label?: string;
        /** Whether text is still arriving. */
        streaming?: boolean;
        /** The text so far. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- StreamingText.svelte -->
<div
    class={`streaming-text ${className}`}
    role="status"
    aria-live="polite"
    aria-atomic="true"
    aria-label={label}
    aria-busy={streaming ? "true" : undefined}
    data-streaming={streaming ? "true" : undefined}
    {...restProps}
>
    {@render children?.()}
</div>
