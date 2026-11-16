<script lang="ts">
    // HeroHeadline component
    //
    // The headline area of a Hero: a media slot (image or video) followed by the headline content. Renders
    // a <div> with the `hero-headline` hook, named by a required label.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name. Rendered as aria-label.
    //   media — Snippet, required. The media shown before the headline.
    //   children — Snippet, optional. The headline content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   {#snippet media()}…{/snippet}
    //   <HeroHeadline label="…" {media}>…</HeroHeadline>
    //
    // Examples:
    //   <HeroHeadline label="Welcome" {media}><h1>Welcome</h1></HeroHeadline>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label`
    //   - With a label the root is role="group", because a plain <div> cannot be named
    //   - The media snippet's own alt text is the consumer's
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Order is media first, then children
    //
    // References:
    //   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        media,
        children,
        ...restProps
    }: {
        label: string;
        media: Snippet;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- HeroHeadline.svelte -->
<div
    class={`hero-headline ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render media?.()}
    {@render children?.()}
</div>
