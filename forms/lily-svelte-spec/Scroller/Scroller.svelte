<script lang="ts">
    // Scroller component
    //
    // A scrollytelling container: a sticky `background` snippet that updates as the foreground steps
    // scroll past. Built on ScrollerBase, which reports the active step; this component adds the
    // background layer and the wrapper.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   offset — number, default 0.5. Where in the viewport (0 top, 1 bottom) a step becomes active; passed to ScrollerBase.
    //   onIndexChange — (index: number) => void, optional. Called when the active step changes.
    //   onProgressChange — (progress: number) => void, optional. Called as the scroll progress through the steps changes.
    //   background — Snippet, required. The sticky layer rendered inside `.scroller-background`.
    //   children — Snippet, required. The foreground steps, rendered inside `.scroller-foreground`.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   {#snippet background()}…{/snippet}
    //   <Scroller {background} onIndexChange={…}>…steps…</Scroller>
    //
    // Examples:
    //   <Scroller label="How it works" {background} onIndexChange={(i) => (step = i)}><div>Step one</div><div>Step two</div></Scroller>
    //
    // Keyboard:
    //   - None of its own; the page scrolls with the usual keys (arrows, Page Up/Down, Space)
    //
    // Accessibility:
    //   - The background layer is aria-live="polite", so changes to it are announced; keep its text short or move it out of the live region
    //   - Content must be reachable without scrolling effects: every step is a normal block in the document
    //   - With a label the root is role="group", because a plain <div> cannot be named
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Sticky positioning is the consumer's CSS
    //   - Respect prefers-reduced-motion in the consumer's background transitions
    //
    // References:
    //   - Reuters Graphics Scroller (the inspiration): https://github.com/reuters-graphics/graphics-components

    import type { Snippet } from "svelte";
    import ScrollerBase from "../ScrollerBase/ScrollerBase.svelte";

    let {
        class: className = "",
        label = undefined,
        offset = 0.5,
        onIndexChange = undefined,
        onProgressChange = undefined,
        children,
        background,
        ...restProps
    }: {
        label?: string;
        offset?: number;
        onIndexChange?: (index: number) => void;
        onProgressChange?: (progress: number) => void;
        children: Snippet;
        background: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Scroller.svelte -->
<div
    class={`scroller ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    <div
        class="scroller-background"
        aria-live="polite"
    >
        {@render background?.()}
    </div>
    <ScrollerBase
        class="scroller-foreground"
        {offset}
        {onIndexChange}
        {onProgressChange}
    >
        {@render children?.()}
    </ScrollerBase>
</div>
