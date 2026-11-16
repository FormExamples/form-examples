<script lang="ts">
    // Visible component
    //
    // An IntersectionObserver wrapper that exposes viewport visibility to the consumer. The children
    // snippet receives the visible boolean, and the same value is rendered as data-visible for CSS. Where
    // IntersectionObserver is missing (older browsers, jsdom) `visible` stays false.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   once — boolean, default false. Stop observing after the first time the element is visible; `visible` then stays at its last value.
    //   threshold — number, default 0. Fraction of the element that must show, passed to IntersectionObserver.
    //   rootMargin — string, default "0px". Passed to IntersectionObserver.
    //   children — Snippet<[boolean]>, required. Receives the visible flag.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Visible once>{#snippet children(visible)}…{/snippet}</Visible>
    //
    // Examples:
    //   <Visible once threshold={0.2}>{#snippet children(visible)}<p>{visible ? "On screen" : "Off screen"}</p>{/snippet}</Visible>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - No role or ARIA: a behaviour wrapper
    //   - Content must not be withheld from assistive technology until it scrolls into view; use `visible` for effects, not to mount essential content
    //   - Respect prefers-reduced-motion for any reveal effect
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The observer is created in an effect and disconnected on cleanup
    //   - Only entries for this element update the state
    //
    // References:
    //   - MDN IntersectionObserver: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    //   - Reuters Graphics Visible (the inspiration): https://github.com/reuters-graphics/graphics-components

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
            { threshold, rootMargin },
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
