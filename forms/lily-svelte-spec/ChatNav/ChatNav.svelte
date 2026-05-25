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

<!-- ChatNav.svelte -->
<div class={`chat-nav ${className}`} aria-label={label} {...restProps}>
    {@render children?.()}
</div>
