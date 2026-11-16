<script lang="ts">
    // HorizontalScroller component
    //
    // A horizontally scrollable region that is keyboard-operable. Renders a <div role="region"
    // tabindex="0"> with the `horizontal-scroller` hook and scrolls it with the arrow keys; pointer and
    // touch scrolling stay native overflow behaviour.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name. Rendered as aria-label.
    //   step — number, default 100. Pixels moved by one ArrowLeft or ArrowRight press.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <HorizontalScroller label="…" step={100}>…</HorizontalScroller>
    //
    // Examples:
    //   <HorizontalScroller label="Quarterly figures"><table>…</table></HorizontalScroller>
    //
    // Keyboard:
    //   - ArrowRight: scrolls right by `step`
    //   - ArrowLeft: scrolls left by `step`
    //   - Home: scrolls to the start
    //   - End: scrolls to the end
    //   - All scrolling is smooth; honour prefers-reduced-motion in the consumer's CSS (scroll-behavior) if needed
    //
    // Accessibility:
    //   - role="region" with aria-label makes it a named landmark
    //   - tabindex="0" makes the scrollable region keyboard-focusable (axe scrollable-region-focusable); the Svelte a11y warning is deliberately ignored
    //   - Left and right keys are physical, not logical: in right-to-left layouts ArrowRight still scrolls right
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Overflow, widths and scroll snapping are the consumer's CSS
    //
    // References:
    //   - axe scrollable-region-focusable: https://dequeuniversity.com/rules/axe/4.10/scrollable-region-focusable
    //   - WCAG 1.4.10 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html

    import { warnMissingName } from "../dev-warning";
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

    $effect(() =>
        warnMissingName(
            "HorizontalScroller",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

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
            scrollerEl.scrollTo({
                left:
                    getComputedStyle(scrollerEl).direction === "rtl"
                        ? -scrollerEl.scrollWidth
                        : scrollerEl.scrollWidth,
                behavior: "smooth",
            });
        }
    }
</script>

<!-- HorizontalScroller.svelte -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex (a scrollable region must be keyboard-focusable (axe scrollable-region-focusable)) -->
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
