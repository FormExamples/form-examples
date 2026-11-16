<script lang="ts">
    // PhotoPack component
    //
    // A group of related photographs. Renders a <div role="group"> with the `photo-pack` hook, named by a
    // required label; layout is the consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the group.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <PhotoPack label="…">…</PhotoPack>
    //
    // Examples:
    //   <PhotoPack label="Site photographs"><img src="a.jpg" alt="Front" /><img src="b.jpg" alt="Rear" /></PhotoPack>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - role="group" with aria-label names the set of photographs
    //   - Each image inside still needs its own alt text
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Ships no images; the consumer supplies them
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- PhotoPack.svelte -->
<div
    class={`photo-pack ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
