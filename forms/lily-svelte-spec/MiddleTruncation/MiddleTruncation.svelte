<script lang="ts">
    // MiddleTruncation component
    //
    // A string shortened in the middle to fit the width its container gives it ("report-fi…q3.pdf"), keeping the start and the
    // end. The width is measured in the browser (canvas text metrics in the element's own font) and re-measured when the
    // container resizes; until then, and on the server, the full text is shown.
    //
    // The full text always stays in the accessibility tree: the shortened string is aria-hidden and the whole text sits in a
    // sibling the consumer visually hides. A screen reader, find-in-page and copy therefore get the real text, which a
    // title attribute (hover only) or a text-only truncation would lose.
    //
    // Props:
    //   class — string, optional. Consumer class appended after the base class.
    //   text — string, required. The full text.
    //   ellipsis — string, required. The cut marker. No default: the headless layer ships no text.
    //   strategy — "even" | "fixed-end" | "min-end", default "even".
    //     even: start and end share the room. fixed-end: exactly `end` characters at the end. min-end: even, but at least `end` at the end.
    //   end — number, optional. Characters kept at the end for "fixed-end" and "min-end".
    //   ...restProps — spread onto the root <span>.
    //
    // Markup:
    //   <span class="middle-truncation" data-strategy data-truncated?>
    //     <span class="middle-truncation-visual" aria-hidden="true">report-fi…q3.pdf</span>
    //     <span class="middle-truncation-full">report-final-q3.pdf</span>
    //   </span>
    //
    // Consumer CSS (the component ships none): the root must be a block with a bounded width, `overflow: hidden` and
    // `white-space: nowrap`, and `.middle-truncation-full` must be visually hidden (clipped, not display:none).
    //
    // Keyboard: none.
    //
    // Claude rules:
    //   - Headless: no CSS, no inline styles.
    //   - No hardcoded user-facing strings: the ellipsis is a required prop.

    import { onMount } from "svelte";
    import { truncateMiddle, type TruncationStrategy } from "./middle-truncation";

    let {
        class: className = "",
        text,
        ellipsis,
        strategy = "even",
        end,
        ...restProps
    }: {
        /** The full text. */
        text: string;
        /** The cut marker; no default. */
        ellipsis: string;
        /** How the room is shared between start and end. */
        strategy?: TruncationStrategy;
        /** Characters kept at the end for "fixed-end" and "min-end". */
        end?: number;
        [key: string]: unknown;
    } = $props();

    let root: HTMLSpanElement | undefined = $state();
    let shown: string | null = $state(null);
    const displayed = $derived(shown ?? text);

    let context: CanvasRenderingContext2D | null | undefined;

    function recalculate(): void {
        if (!root) return;
        const width = root.clientWidth;
        if (context === undefined) context = document.createElement("canvas").getContext("2d");
        if (!context || width <= 0) {
            shown = null;
            return;
        }
        const style = getComputedStyle(root);
        context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const ctx = context;
        const result = truncateMiddle(text, {
            ellipsis,
            strategy,
            end,
            maxWidth: width,
            measure: (s) => ctx.measureText(s).width,
        });
        shown = result === text ? null : result;
    }

    // Re-measure whenever the text or the options change.
    $effect(() => {
        void [text, ellipsis, strategy, end]; // read so the effect tracks them
        recalculate();
    });

    // Re-measure when the container resizes, at most once per animation frame.
    onMount(() => {
        if (!root || typeof ResizeObserver === "undefined") return;
        let frame = 0;
        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(recalculate);
        });
        observer.observe(root);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    });
</script>

<!-- MiddleTruncation.svelte -->
<span
    bind:this={root}
    class={`middle-truncation ${className}`}
    data-strategy={strategy}
    data-truncated={shown === null ? undefined : ""}
    {...restProps}
    ><span
        class="middle-truncation-visual"
        aria-hidden="true">{displayed}</span
    ><span class="middle-truncation-full">{text}</span></span
>
