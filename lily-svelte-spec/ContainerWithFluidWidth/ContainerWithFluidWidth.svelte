<script lang="ts">
    // ContainerWithFluidWidth component
    //
    // A headless full-width content wrapper with horizontal padding. Renders a
    // `<div>` that spans the full width of its parent and applies a configurable
    // `padding-inline` so content does not touch viewport edges.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   paddingInline — string, default "1rem". Horizontal padding CSS value.
    //   children — Snippet, required. The content to wrap.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ContainerWithFluidWidth paddingInline="2rem">…</ContainerWithFluidWidth>
    //
    // Examples:
    //   <ContainerWithFluidWidth paddingInline="clamp(1rem, 4vw, 3rem)">
    //     <section>…</section>
    //   </ContainerWithFluidWidth>
    //
    // Keyboard:
    //   - None (purely structural)
    //
    // Accessibility:
    //   - No ARIA role (presentational layout container)
    //
    // Internationalization:
    //   - All text comes through children; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: only inline styles are `width: 100%` and `padding-inline` (functional layout)
    //
    // References:
    //   - MDN padding-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        paddingInline = "1rem",
        children,
        ...restProps
    }: {
        /** Horizontal padding CSS value */
        paddingInline?: string;
        /** Container content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ContainerWithFluidWidth.svelte -->
<div
    class={`container-with-fluid-width ${className}`}
    data-padding-inline={paddingInline}
    style={`width: 100%; padding-inline: ${paddingInline};`}
    {...restProps}
>
    {@render children?.()}
</div>
