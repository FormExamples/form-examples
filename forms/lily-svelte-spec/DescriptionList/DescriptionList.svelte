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

<!-- DescriptionList.svelte -->
<dl
    class={`description-list ${className}`}


    {...restProps}
>
    {@render children?.()}
</dl>
