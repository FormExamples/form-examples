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

<!-- MockupTabletPortrait.svelte -->
<div class={`mockup-tablet-portrait ${className}`} aria-label={label} {...restProps}>
    {@render children?.()}
</div>
