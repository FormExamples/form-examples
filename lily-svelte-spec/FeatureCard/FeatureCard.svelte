<script lang="ts">
    // FeatureCard component
    //
    // A large content card with a prominent image positioned alongside or
    // above the text. Renders a native <article> landmark with a labelled
    // accessible name. The `heading` prop is required; the visible heading
    // also serves as the default aria-label.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   heading — string, REQUIRED. Card heading.
    //   imagePosition — "start" | "end" | "top", default "start".
    //   imageUrl — string, optional. Image URL.
    //   imageAlt — string, optional. Image alt text.
    //   description — string, optional. Body text.
    //   label — string, optional. aria-label override (defaults to heading).
    //   children — Snippet, optional. Additional content e.g. CTAs.
    //   ...restProps — additional HTML attributes spread onto the <article>.
    //
    // Syntax:
    //   <FeatureCard heading="Privacy first" description="Your data stays yours." imageUrl="/img.png" imageAlt="" />
    //
    // Accessibility:
    //   - article landmark with aria-label
    //
    // Internationalization:
    //   - All text content via props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - heading is REQUIRED — TypeScript reflects this

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        heading,
        imagePosition = "start",
        imageUrl = undefined,
        imageAlt = undefined,
        description = undefined,
        label = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Consumer CSS class appended to base class */
        class?: string;
        /** Card heading (REQUIRED) */
        heading: string;
        /** Where the image sits relative to text */
        imagePosition?: "start" | "end" | "top";
        /** Image URL */
        imageUrl?: string;
        /** Image alt text */
        imageAlt?: string;
        /** Body text */
        description?: string;
        /** aria-label override (defaults to heading) */
        label?: string;
        /** Additional content e.g. CTAs */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- FeatureCard.svelte -->
<article
    class={`feature-card ${className}`}
    data-image-position={imagePosition}
    aria-label={label || heading}
    {...restProps}
>
    {#if imageUrl}
        <img class="feature-card-image" src={imageUrl} alt={imageAlt ?? ""} />
    {/if}
    <header class="feature-card-header">
        <h3 class="feature-card-heading">{heading}</h3>
    </header>
    {#if description}
        <p class="feature-card-description">{description}</p>
    {/if}
    {#if children}{@render children?.()}{/if}
</article>
