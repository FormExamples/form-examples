<script lang="ts">
    // ScrollBar component
    //
    // A headless scrollbar track element that provides the ARIA scrollbar role
    // and value attributes for a custom scrollbar control. Renders a focusable
    // <div> with orientation, value range, and accessible labeling, and owns the
    // keyboard: the keys move the bindable value. The consumer provides the
    // visual thumb element as children, scrolls its content to the value, and
    // implements drag handling.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   orientation — "vertical" | "horizontal", default "vertical". The scrollbar direction.
    //   value — number, default 0. Bindable. The scroll position, reflected in aria-valuenow.
    //   min — number, default 0. The start of the range.
    //   max — number, default 100. The end of the range.
    //   step — number, default 1. The arrow-key increment.
    //   pageStep — number, default 10. The Page Up / Page Down increment.
    //   controls — string, optional. The id of the scrolled element, via aria-controls.
    //   label — string, required. Accessible name for the scrollbar via aria-label.
    //   children — Snippet, required. ScrollBar content, typically the draggable thumb element.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ScrollBar orientation="vertical" label="Scroll" controls="messages" bind:value={position}>
    //     <div>thumb</div>
    //   </ScrollBar>
    //
    // Examples:
    //   <!-- Horizontal scrollbar for a timeline -->
    //   <ScrollBar orientation="horizontal" label="Timeline scroll">
    //     <div class="thumb"></div>
    //   </ScrollBar>
    //
    //   <!-- Vertical scrollbar bound to the consumer's scroll position -->
    //   <ScrollBar orientation="vertical" label="Page scroll" bind:value={scrollPos}>
    //     <div class="thumb"></div>
    //   </ScrollBar>
    //
    // Keyboard:
    //   - Arrow Up/Left: decrease value by step
    //   - Arrow Down/Right: increase value by step
    //   - Page Up/Down: decrease/increase value by pageStep
    //   - Home: value to min
    //   - End: value to max
    //   The value is clamped to [min, max].
    //
    // Accessibility:
    //   - role="scrollbar" identifies the element as a scrollbar control
    //   - aria-orientation indicates horizontal or vertical direction
    //   - aria-valuenow/aria-valuemin/aria-valuemax track scroll position
    //   - aria-label provides the accessible name
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - The component moves the value on keys; the consumer scrolls its content to
    //     the value, writes the value back as the content scrolls, and handles drag
    //
    // References:
    //   - WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        orientation = "vertical",
        value = $bindable(0),
        min = 0,
        max = 100,
        step = 1,
        pageStep = 10,
        controls = undefined,
        label,
        children,
        ...restProps
    }: {
        /** ScrollBar orientation. */
        orientation?: "vertical" | "horizontal";
        /** Scroll position. Bindable. */
        value?: number;
        /** Start of the range. */
        min?: number;
        /** End of the range. */
        max?: number;
        /** Arrow-key increment. */
        step?: number;
        /** Page Up / Page Down increment. */
        pageStep?: number;
        /** Id of the scrolled element. */
        controls?: string;
        /** Accessible label. */
        label: string;
        /** ScrollBar content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("ScrollBar", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    function clamp(v: number): number {
        return Math.min(max, Math.max(min, v));
    }

    function onkeydown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowUp":
            case "ArrowLeft":
                value = clamp(value - step);
                break;
            case "ArrowDown":
            case "ArrowRight":
                value = clamp(value + step);
                break;
            case "PageUp":
                value = clamp(value - pageStep);
                break;
            case "PageDown":
                value = clamp(value + pageStep);
                break;
            case "Home":
                value = min;
                break;
            case "End":
                value = max;
                break;
            default:
                return;
        }
        event.preventDefault();
    }
</script>

<!-- ScrollBar.svelte -->
<div
    class={`scroll-bar ${className}`}
    role="scrollbar"
    aria-label={label}
    aria-orientation={orientation}
    aria-controls={controls}
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    tabindex="0"
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</div>
