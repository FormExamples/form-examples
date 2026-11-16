<script lang="ts">
    // GraphicBlock component
    //
    // A wrapper for charts and graphics. Renders a <figure role="img"> named by `label`, so the whole
    // graphic announces as a single image, with an optional <figcaption> gathering the title, description
    // and notes, then a `.graphic-block-content` div holding the graphic.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name. Rendered as aria-label.
    //   title — string, optional. Rendered in `.graphic-block-title`.
    //   description — string, optional. Rendered in `.graphic-block-description`.
    //   notes — string, optional. Rendered in `.graphic-block-notes`.
    //   children — Snippet, required. The graphic (SVG, canvas or image).
    //   ...restProps — additional HTML attributes spread onto the root <figure>.
    //
    // Syntax:
    //   <GraphicBlock label="…" title="…">…graphic…</GraphicBlock>
    //
    // Examples:
    //   <GraphicBlock label="Bar chart of sales by month" title="Sales" notes="Source: finance"><svg viewBox="0 0 100 50">…</svg></GraphicBlock>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - role="img" makes everything inside presentational, including the figcaption text and any interactive content; give the data in an accessible table beside the figure, not inside it
    //   - `label` should say what the graphic shows, not just that it is a chart
    //
    // Internationalization:
    //   - title, description and notes are consumer-supplied strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The caption element appears only when at least one of title, description or notes is given
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
    //   - Reuters Graphics GraphicBlock (the inspiration): https://github.com/reuters-graphics/graphics-components

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        title = undefined,
        description = undefined,
        notes = undefined,
        children,
        ...restProps
    }: {
        label: string;
        title?: string;
        description?: string;
        notes?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let hasCaption = $derived(
        title !== undefined || description !== undefined || notes !== undefined,
    );
</script>

<!-- GraphicBlock.svelte -->
<figure
    class={`graphic-block ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {#if hasCaption}
        <figcaption class="graphic-block-caption">
            {#if title !== undefined}
                <div class="graphic-block-title">{title}</div>
            {/if}
            {#if description !== undefined}
                <div class="graphic-block-description">{description}</div>
            {/if}
            {#if notes !== undefined}
                <div class="graphic-block-notes">{notes}</div>
            {/if}
        </figcaption>
    {/if}
    <div class="graphic-block-content">{@render children?.()}</div>
</figure>
