<script lang="ts">
    // HorizontalScroller component
    //
    // A horizontally scrollable region. Renders <div role="region"> with
    // tabindex=0 and handles ArrowLeft / ArrowRight to scroll horizontally.
    // Pointer / touch scrolling is left to native overflow behaviour.

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        step = 100,
        children,
        ...restProps
    }: {
        label: string;
        step?: number;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let scrollerEl: HTMLDivElement | undefined = $state(undefined);

    function onkeydown(event: KeyboardEvent) {
        if (!scrollerEl) return;
        if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollerEl.scrollBy({ left: step, behavior: "smooth" });
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollerEl.scrollBy({ left: -step, behavior: "smooth" });
        } else if (event.key === "Home") {
            event.preventDefault();
            scrollerEl.scrollTo({ left: 0, behavior: "smooth" });
        } else if (event.key === "End") {
            event.preventDefault();
            scrollerEl.scrollTo({ left: scrollerEl.scrollWidth, behavior: "smooth" });
        }
    }
</script>

<!-- HorizontalScroller.svelte -->
<div
    bind:this={scrollerEl}
    class={`horizontal-scroller ${className}`}
    role="region"
    aria-label={label}
    tabindex="0"
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</div>
