<script lang="ts">
    // FlexStack component
    //
    // A headless flex layout container for vertical or horizontal stacking with
    // a consistent gap. Renders a `<div>` with inline `display: flex` and the
    // requested direction, gap, alignment, and justification. The inline style
    // implements the headless behavior; consumer CSS may extend visual treatment.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   direction — "row" | "column", default "column". Flex direction.
    //   gap — string, default "1rem". Gap CSS value.
    //   align — string, optional. align-items value.
    //   justify — string, optional. justify-content value.
    //   children — Snippet, required. The stacked content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <FlexStack direction="row" gap="0.5rem">…</FlexStack>
    //
    // Examples:
    //   <FlexStack direction="row" gap="1rem" align="center" justify="space-between">
    //     <span>Left</span>
    //     <span>Right</span>
    //   </FlexStack>
    //
    // Keyboard:
    //   - None (purely structural)
    //
    // Accessibility:
    //   - No ARIA role (presentational layout container)
    //
    // Internationalization:
    //   - All text comes through children; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: only inline styles are flex behavior (display, direction, gap, align, justify)
    //
    // References:
    //   - MDN flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        direction = "column",
        gap = "1rem",
        align = undefined,
        justify = undefined,
        children,
        ...restProps
    }: {
        /** Flex direction */
        direction?: "row" | "column";
        /** Gap CSS value */
        gap?: string;
        /** align-items value */
        align?: string;
        /** justify-content value */
        justify?: string;
        /** Children content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const styleString = $derived(
        [
            "display: flex",
            `flex-direction: ${direction}`,
            `gap: ${gap}`,
            align ? `align-items: ${align}` : "",
            justify ? `justify-content: ${justify}` : "",
        ].filter(Boolean).join("; ") + ";"
    );
</script>

<!-- FlexStack.svelte -->
<div
    class={`flex-stack ${className}`}
    data-direction={direction}
    style={styleString}
    {...restProps}
>
    {@render children?.()}
</div>
