<script lang="ts">
    // Person component
    //
    // A person. No schema.org microdata is rendered. Renders an <article> with the `person` hook around the consumer's name,
    // role and contact details.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The person details.
    //   ...restProps — additional HTML attributes spread onto the root <article>.
    //
    // Syntax:
    //   <Person label="…">…</Person>
    //
    // Examples:
    //   <Person label="Sam Lee"><h3>Sam Lee</h3></Person>
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
    //   - schema.org Person: https://schema.org/Person

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

<!-- Person.svelte -->
<article
    class={`person ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</article>
