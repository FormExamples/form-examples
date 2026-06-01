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

<!-- ScreenReaderSpan.svelte -->
<div class={`screen-reader-span ${className}`} aria-label={label} {...restProps}>
    {@render children?.()}
</div>
