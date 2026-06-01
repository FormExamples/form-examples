<script lang="ts">
    // Affix component
    //
    // A wrapper that pins its content to a viewport position while the page scrolls.
    // Uses CSS `position: sticky` as the headless behavior so consumers do not
    // need extra JavaScript. Either `offsetTop` or `offsetBottom` controls the
    // sticky position; if neither is given, the element pins to top: 0.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   offsetTop — number (px), optional. Distance from the top edge when affixed.
    //   offsetBottom — number (px), optional. Distance from the bottom edge when affixed.
    //   children — Snippet, required. The content to be pinned.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Affix offsetTop={64}>{#snippet children()}…{/snippet}</Affix>
    //
    // Examples:
    //   <Affix offsetTop={0}>Sticky toolbar</Affix>
    //   <Affix offsetBottom={16}>Bottom-anchored controls</Affix>
    //
    // Accessibility:
    //   - Purely structural; no ARIA roles or states.
    //
    // Internationalization:
    //   - No user-facing strings.
    //
    // Claude rules:
    //   - Headless: inline `position: sticky` style is documented behavior.
    //   - Data attributes expose offsets so consumer CSS can hook in.
    //
    // References:
    //   - Ant Design Affix: https://ant.design/components/affix
    //   - MDN position: sticky: https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky_positioning

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        offsetTop = undefined,
        offsetBottom = undefined,
        children,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Distance from top edge when affixed, in pixels */
        offsetTop?: number;
        /** Distance from bottom edge when affixed, in pixels */
        offsetBottom?: number;
        /** Pinned content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const stickyStyle = $derived.by(() => {
        if (offsetBottom !== undefined) {
            return `position: sticky; bottom: ${offsetBottom}px;`;
        }
        const top = offsetTop ?? 0;
        return `position: sticky; top: ${top}px;`;
    });
</script>

<!-- Affix.svelte -->
<div
    class={`affix ${className}`}
    style={stickyStyle}
    data-offset-top={offsetTop}
    data-offset-bottom={offsetBottom}
    {...restProps}
>
    {@render children?.()}
</div>
