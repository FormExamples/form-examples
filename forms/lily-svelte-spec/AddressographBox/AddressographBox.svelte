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

<!-- AddressographBox.svelte -->
<div class={`addressograph-box ${className}`} aria-label={label} {...restProps}>
    {@render children?.()}
</div>
