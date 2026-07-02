<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        width = "normal",
        children,
        ...restProps
    }: {
        width?: "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid";
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ContentBlock.svelte -->
<div
    class={`content-block ${className}`}
    data-width={width}
    {...restProps}
>
    {@render children?.()}
</div>
