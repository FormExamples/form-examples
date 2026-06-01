<script lang="ts">
    // Watermark component
    //
    // A decorative repeating overlay text or image marking a page. The headless
    // implementation exposes the configuration as data-* attributes; the
    // consumer is responsible for the actual repeating-pattern CSS (e.g.,
    // background-image with SVG-encoded text).
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   text — string, optional. Watermark text.
    //   imageUrl — string, optional. Watermark image URL (alternative to text).
    //   gap — string, default "100px". Spacing between repeats (CSS length).
    //   rotate — number (deg), default -22. Rotation angle.
    //   children — Snippet, optional. Content beneath the watermark.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Watermark text="Confidential">
    //     {#snippet children()}<article>…</article>{/snippet}
    //   </Watermark>
    //
    // Accessibility:
    //   - The watermark overlay has aria-hidden="true" (decorative).
    //
    // Internationalization:
    //   - text comes through props.
    //
    // Claude rules:
    //   - Headless: no styles. Consumer provides repeating-pattern CSS.
    //
    // References:
    //   - Ant Design Watermark: https://ant.design/components/watermark

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        text = undefined,
        imageUrl = undefined,
        gap = "100px",
        rotate = -22,
        children = undefined,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Watermark text */
        text?: string;
        /** Watermark image URL */
        imageUrl?: string;
        /** Spacing between repeats (CSS length) */
        gap?: string;
        /** Rotation angle in degrees */
        rotate?: number;
        /** Content beneath the watermark */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Watermark.svelte -->
<div
    class={`watermark ${className}`}
    data-rotate={rotate}
    data-gap={gap}
    {...restProps}
>
    <div
        class="watermark-overlay"
        aria-hidden="true"
        data-text={text}
        data-image-url={imageUrl}
    ></div>
    {#if children}{@render children?.()}{/if}
</div>
