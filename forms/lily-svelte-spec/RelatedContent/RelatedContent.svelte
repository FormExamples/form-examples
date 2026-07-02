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

<!-- RelatedContent.svelte -->
<aside
    class={`related-content ${className}`}

    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</aside>
