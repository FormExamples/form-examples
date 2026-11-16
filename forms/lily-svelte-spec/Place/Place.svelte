<script lang="ts">
    // Place component
    //
    // A place. No schema.org microdata is rendered. Renders an <article> with the `place` hook around the consumer's name and
    // address.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The place details.
    //   ...restProps — additional HTML attributes spread onto the root <article>.
    //
    // Syntax:
    //   <Place label="…">…</Place>
    //
    // Examples:
    //   <Place label="Town hall"><h3>Town hall</h3></Place>
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
    //   - schema.org Place: https://schema.org/Place

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

<!-- Place.svelte -->
<article
    class={`place ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</article>
