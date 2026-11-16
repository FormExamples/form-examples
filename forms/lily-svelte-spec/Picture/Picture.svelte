<script lang="ts">
    // Picture component
    //
    // A wrapper around the native <picture> element: the browser chooses among the source children (by
    // media query, image type or resolution) and falls back to the img child. Renders a <picture> with the
    // `picture` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, optional. The <source> elements, then one <img> with its alt, width and height.
    //   ...restProps — additional HTML attributes spread onto the root <picture>.
    //
    // Syntax:
    //   <Picture><source … /><img … /></Picture>
    //
    // Examples:
    //   <Picture><source srcset="wide.avif" media="(min-width: 48rem)" type="image/avif" /><img src="narrow.jpg" alt="Description" width="640" height="360" /></Picture>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - The text alternative is the child <img>'s alt, which the consumer must supply
    //   - Give the <img> width and height so the layout does not shift
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Draws nothing and carries no strings of its own; ships no images
    //
    // References:
    //   - MDN <picture>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** The source elements, then one img with its alt, width and height. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Picture.svelte -->
<picture
    class={`picture ${className}`}
    {...restProps}
>
    {@render children?.()}
</picture>
