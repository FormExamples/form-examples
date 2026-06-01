<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        media,
        children,
        ...restProps
    }: {
        label: string;
        media: Snippet;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- HeroHeadline.svelte -->
<div
    class={`hero-headline ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render media?.()}
    {@render children?.()}
</div>
