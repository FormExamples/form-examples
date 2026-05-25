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

<!-- Citation.svelte -->
<div class={`citation ${className}`} aria-label={label} {...restProps}>
    {@render children?.()}
</div>
