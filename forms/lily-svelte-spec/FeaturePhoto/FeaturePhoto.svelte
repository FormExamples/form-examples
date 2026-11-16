<script lang="ts">
    // FeaturePhoto component
    //
    // A responsive feature photo with required alt text and an optional caption and credit. Renders a
    // <figure> holding an <img class="feature-photo-image"> and, when a caption or credit snippet is
    // given, a <figcaption class="feature-photo-caption"> with `.feature-photo-caption-text` and
    // `.feature-photo-credit` spans.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   src — string, required. The image URL.
    //   alt — string, required. The text alternative.
    //   loading — "lazy" | "eager", default "lazy".
    //   width — number, optional. Intrinsic width, to reserve space.
    //   height — number, optional. Intrinsic height, to reserve space.
    //   caption — Snippet, optional. Caption text.
    //   credit — Snippet, optional. Photographer or source credit.
    //   ...restProps — additional HTML attributes spread onto the root <figure>.
    //
    // Syntax:
    //   <FeaturePhoto src="…" alt="…" {caption} {credit} />
    //
    // Examples:
    //   <FeaturePhoto src="/hall.jpg" alt="The main hall" width={1200} height={800} {caption} />
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - `alt` is required: describe the picture's content, or use alt="" only if the caption says everything
    //   - <figure> with <figcaption> associates the caption with the image natively
    //
    // Internationalization:
    //   - Caption, credit and alt are consumer-supplied
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - restProps land on the <figure>, not the <img>
    //
    // References:
    //   - MDN <figure>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        src,
        alt,
        loading = "lazy",
        width = undefined,
        height = undefined,
        caption = undefined,
        credit = undefined,
        ...restProps
    }: {
        src: string;
        alt: string;
        loading?: "lazy" | "eager";
        width?: number;
        height?: number;
        caption?: Snippet;
        credit?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- FeaturePhoto.svelte -->
<figure
    class={`feature-photo ${className}`}
    {...restProps}
>
    <img
        class="feature-photo-image"
        {src}
        {alt}
        {loading}
        {width}
        {height}
    />
    {#if caption || credit}
        <figcaption class="feature-photo-caption">
            {#if caption}
                <span class="feature-photo-caption-text">{@render caption()}</span>
            {/if}
            {#if credit}
                <span class="feature-photo-credit">{@render credit()}</span>
            {/if}
        </figcaption>
    {/if}
</figure>
