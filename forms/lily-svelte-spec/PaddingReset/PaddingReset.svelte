<script lang="ts">
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
