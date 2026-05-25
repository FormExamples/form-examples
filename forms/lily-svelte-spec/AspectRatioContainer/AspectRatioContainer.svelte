<script lang="ts">
    // AspectRatioContainer component
    //
    // A headless layout container that maintains a specific width-to-height
    // aspect ratio for its content. Sets CSS aspect-ratio-container via a style attribute
    // and exposes a data-aspect-ratio-container attribute for consumer styling hooks.
    // Useful for responsive images, videos, cards, and any content that must
    // maintain consistent proportions across screen sizes.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   ratio    — number, default 1. Aspect ratio as width/height.
    //              Common values: 16/9, 4/3, 1 (square), 21/9 (ultrawide).
    //   children — Snippet, required. Content to display inside the container.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <AspectRatioContainer ratio={16/9}>content</AspectRatioContainer>
    //
    // Examples:
    //   <!-- 16:9 video container -->
    //   <AspectRatioContainer ratio={16/9}>
    //     <video src="video.mp4"></video>
    //   </AspectRatioContainer>
    //
    //   <!-- Square avatar frame -->
    //   <AspectRatioContainer ratio={1}>
    //     <img src="avatar.jpg" alt="User avatar" />
    //   </AspectRatioContainer>
    //
    //   <!-- 4:3 card layout -->
    //   <AspectRatioContainer ratio={4/3} data-testid="card-frame">
    //     <p>Card content</p>
    //   </AspectRatioContainer>
    //
    // Keyboard: None — this is a layout utility, not an interactive element.
    //
    // Accessibility:
    //   - No specific ARIA role needed; this is a layout utility
    //   - Content within maintains its own accessibility semantics
    //   - data-aspect-ratio-container attribute exposed for consumer CSS queries
    //
    // Internationalization:
    //   - No user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles beyond the inline aspect-ratio-container
    //   - Uses CSS aspect-ratio-container property (not padding-bottom hack)
    //   - Do not add overflow: hidden — consumer handles clipping
    //
    // References:
    //   - CSS aspect-ratio-container: https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio-container

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        ratio = 1,
        children,
        ...restProps
    }: {
        /** The aspect ratio as a number (width / height), e.g. 16/9 */
        ratio?: number;
        /** The content to display within the aspect ratio container */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AspectRatioContainer.svelte -->
<div
    class={`aspect-ratio-container ${className}`}
    style:aspect-ratio={ratio}
    data-aspect-ratio-container={ratio}
    {...restProps}
>
    {@render children?.()}
</div>
