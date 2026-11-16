<script lang="ts">
    // Organization component
    //
    // An organisation (a company, charity or public body). No schema.org microdata is rendered. Renders an <article> with the
    // `organization` hook around the consumer's details.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The organisation details.
    //   ...restProps — additional HTML attributes spread onto the root <article>.
    //
    // Syntax:
    //   <Organization label="…">…</Organization>
    //
    // Examples:
    //   <Organization label="Example Organisation"><h3>Example Organisation</h3></Organization>
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
    //   - schema.org Organization: https://schema.org/Organization

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

<!-- Organization.svelte -->
<article
    class={`organization ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</article>
