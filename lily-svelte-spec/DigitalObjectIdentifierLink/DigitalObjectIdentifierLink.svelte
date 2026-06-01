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

<!-- DigitalObjectIdentifierLink.svelte -->
<div class={`digital-object-identifier-link ${className}`} aria-label={label} {...restProps}>
    {@render children?.()}
</div>
