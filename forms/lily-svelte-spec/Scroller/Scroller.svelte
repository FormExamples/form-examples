<script lang="ts">
    // Scroller component
    //
    // Scrollytelling container with a sticky `background` snippet that
    // updates as foreground steps scroll past. Built on ScrollerBase.

    import type { Snippet } from "svelte";
    import ScrollerBase from "../ScrollerBase/ScrollerBase.svelte";

    let {
        class: className = "",
        label = undefined,
        offset = 0.5,
        onIndexChange = undefined,
        onProgressChange = undefined,
        children,
        background,
        ...restProps
    }: {
        label?: string;
        offset?: number;
        onIndexChange?: (index: number) => void;
        onProgressChange?: (progress: number) => void;
        children: Snippet;
        background: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Scroller.svelte -->
<div
    class={`scroller ${className}`}
    aria-label={label}
    {...restProps}
>
    <div class="scroller-background" aria-live="polite">
        {@render background?.()}
    </div>
    <ScrollerBase
        class="scroller-foreground"
        {offset}
        {onIndexChange}
        {onProgressChange}
    >
        {@render children?.()}
    </ScrollerBase>
</div>
