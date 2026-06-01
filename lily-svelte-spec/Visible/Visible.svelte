<script lang="ts">
    // Visible component
    //
    // IntersectionObserver wrapper that exposes viewport visibility to the
    // consumer through a snippet that receives the visible boolean.

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        once = false,
        threshold = 0,
        rootMargin = "0px",
        children,
        ...restProps
    }: {
        once?: boolean;
        threshold?: number;
        rootMargin?: string;
        children: Snippet<[boolean]>;
        [key: string]: unknown;
    } = $props();

    let visible = $state(false);
    let visibleEl: HTMLDivElement | undefined = $state(undefined);

    $effect(() => {
        const el = visibleEl;
        if (!el || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.target === el) {
                        visible = entry.isIntersecting;
                        if (once && entry.isIntersecting) {
                            observer.disconnect();
                        }
                    }
                }
            },
            { threshold, rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    });
</script>

<!-- Visible.svelte -->
<div
    bind:this={visibleEl}
    class={`visible ${className}`}
    data-visible={visible}
    {...restProps}
>
    {@render children?.(visible)}
</div>
