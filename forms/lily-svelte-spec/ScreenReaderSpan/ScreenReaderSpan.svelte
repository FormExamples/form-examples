<script lang="ts">
    // ScreenReaderSpan component
    //
    // Text meant for assistive technology. Renders a <span> with the `screen-reader-span` hook; the
    // visually-hidden CSS that makes it screen-reader-only is the consumer's.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The text for screen readers.
    //   ...restProps — additional HTML attributes spread onto the root <span>.
    //
    // Syntax:
    //   <ScreenReaderSpan label="…">…</ScreenReaderSpan>
    //
    // Examples:
    //   <a href="/name">Change<ScreenReaderSpan> name</ScreenReaderSpan></a>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - Hide it visually in CSS with a clip pattern, never `display: none` or `hidden`, which also remove it from the accessibility tree
    //   - aria-label from `label` is also rendered when given; usually the children alone are enough
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ScreenReaderSpan.svelte -->
<span
    class={`screen-reader-span ${className}`}
    {...restProps}
>
    {@render children?.()}
</span>
