<script lang="ts">
    // FeaturePhoto component
    //
    // A responsive feature photo with required alt text and optional
    // caption / credit. Renders <figure> + <img> + <figcaption>.

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
<figure class={`feature-photo ${className}`} {...restProps}>
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
