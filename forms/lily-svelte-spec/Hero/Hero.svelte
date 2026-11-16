<script lang="ts">
    // Hero component
    //
    // A prominent introductory banner at the top of a page or section. Renders a <section> with the `hero`
    // hook around the consumer's headline, text and media.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The hero content.
    //   ...restProps — additional HTML attributes spread onto the root <section>.
    //
    // Syntax:
    //   <Hero label="…">…</Hero>
    //
    // Examples:
    //   <Hero label="Welcome"><h1>Welcome</h1></Hero>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - A <section> with an accessible name is exposed as a region landmark
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <section>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section

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

<!-- Hero.svelte -->
<section
    class={`hero ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</section>
