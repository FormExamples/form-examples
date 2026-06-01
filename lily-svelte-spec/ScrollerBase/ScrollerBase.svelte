<script lang="ts">
    // ScrollerBase component
    //
    // A low-level scroll-position tracking primitive for scrollytelling.
    // Direct children are treated as steps. IntersectionObserver reports
    // the active step index (via onIndexChange callback), and a scroll
    // listener computes overall progress (via onProgressChange).

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        offset = 0.5,
        onIndexChange = undefined,
        onProgressChange = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        offset?: number;
        onIndexChange?: (index: number) => void;
        onProgressChange?: (progress: number) => void;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let scrollerEl: HTMLDivElement | undefined = $state(undefined);

    $effect(() => {
        const root = scrollerEl;
        if (!root || typeof IntersectionObserver === "undefined") return;

        const steps = Array.from(root.children) as HTMLElement[];
        const triggerFromTop = `${(offset * 100).toFixed(2)}%`;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const idx = steps.indexOf(entry.target as HTMLElement);
                        if (idx !== -1) onIndexChange?.(idx);
                    }
                }
            },
            {
                rootMargin: `-${triggerFromTop} 0px -${(100 - offset * 100).toFixed(2)}% 0px`,
                threshold: 0,
            }
        );
        for (const step of steps) observer.observe(step);

        const onScroll = () => {
            const rect = root.getBoundingClientRect();
            const winH = window.innerHeight || 1;
            const total = rect.height + winH;
            const passed = winH - rect.top;
            const progress = Math.max(0, Math.min(1, passed / total));
            onProgressChange?.(progress);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    });
</script>

<!-- ScrollerBase.svelte -->
<div
    bind:this={scrollerEl}
    class={`scroller-base ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
