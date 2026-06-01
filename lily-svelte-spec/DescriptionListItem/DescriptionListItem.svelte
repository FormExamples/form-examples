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

<!-- DescriptionListItem.svelte -->
<div
    class={`description-list-item ${className}`}


    {...restProps}
>
    {@render children?.()}
</div>
