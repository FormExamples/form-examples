<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ArticleLayout.svelte -->
<article
    class={`article-layout ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</article>
