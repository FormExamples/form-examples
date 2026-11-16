<script lang="ts">
    // Image component
    //
    // An image component that displays visual content with proper accessibility through
    // required alt text. It renders a plain <img>; for a caption, wrap it in Figure with a
    // Caption. Supports native lazy loading.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   src — string, required. The image source URL.
    //   alt — string, required. Alternative text describing the image for screen readers.
    //   loading — "lazy" | "eager", default undefined. Controls native browser loading behavior.
    //   ...restProps — additional HTML attributes spread onto the <img>.
    //
    // Syntax:
    //   <Image src="/photo.jpg" alt="Description" />
    //
    // Examples:
    //   <Image src="/photo.jpg" alt="A sunset over the ocean" />
    //
    //   <Figure><Image src="/photo.jpg" alt="A sunset over the ocean" /><Caption>Photo by Jane Doe</Caption></Figure>
    //
    //   <Image src="/large-photo.jpg" alt="Landscape" loading="lazy" />
    //
    // Keyboard:
    //   - None — images are not interactive by default
    //
    // Accessibility:
    //   - alt attribute provides the accessible name for the image (required)
    //   - Screen readers announce the alt text when encountering the image
    //
    // Internationalization:
    //   - The alt prop allows localized text; no hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - restProps spread onto the <img>
    //   - alt prop is required to enforce accessibility
    //
    // References:
    //   - WAI Images Tutorial: https://www.w3.org/WAI/tutorials/images/
    //   - HTML figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure

    let {
        class: className = "",
        src,
        alt,
        loading = undefined,
        ...restProps
    }: {
        src: string;
        alt: string;
        loading?: "lazy" | "eager";
        [key: string]: unknown;
    } = $props();
</script>

<!-- Image.svelte -->
<img
    class={`image ${className}`}
    {src}
    {alt}
    {loading}
    {...restProps}
/>
