<script lang="ts">
    // Container component
    // A generic block-level content container.

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Container.svelte -->
<div
    class={`container ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
