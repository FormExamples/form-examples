<script lang="ts">
    // Container component
    //
    // A generic block-level content container. Renders a <div> with the `container` hook and no ARIA; use
    // ContainerWithFixedWidth or ContainerWithFluidWidth when a width behaviour is wanted.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, optional. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Container>…</Container>
    //
    // Examples:
    //   <Container><p>Content</p></Container>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - No role or ARIA: a generic wrapper
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Container.svelte -->
<div
    class={`container ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
