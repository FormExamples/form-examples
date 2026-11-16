<script lang="ts">
    // PaddingReset component
    //
    // A presentational container that lets content break out of a padded parent. The component only
    // renders the `padding-reset` hook; the negative margins that cancel the parent's padding are the
    // consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. The content that breaks out.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <PaddingReset>…</PaddingReset>
    //
    // Examples:
    //   <ContentBlock><PaddingReset><img src="wide.jpg" alt="Description" /></PaddingReset></ContentBlock>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - No role or ARIA: purely presentational
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The component sets no margin; the consumer's CSS on `.padding-reset` does the reset
    //
    // References:
    //   - Reuters Graphics PaddingReset (the inspiration): https://github.com/reuters-graphics/graphics-components

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- PaddingReset.svelte -->
<div
    class={`padding-reset ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
