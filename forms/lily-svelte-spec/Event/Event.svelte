<script lang="ts">
    // Event component
    //
    // An event (a meeting, appointment or occasion). No schema.org microdata is rendered. Renders an <article> with the `event`
    // hook around the consumer's name, date and place.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The event details.
    //   ...restProps — additional HTML attributes spread onto the root <article>.
    //
    // Syntax:
    //   <Event label="…">…</Event>
    //
    // Examples:
    //   <Event label="Annual meeting"><h3>Annual meeting</h3><time datetime="2026-12-01">1 December 2026</time></Event>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - The native <article> element supplies the article role
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
    //   - schema.org Event: https://schema.org/Event

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Event.svelte -->
<article
    class={`event ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</article>
