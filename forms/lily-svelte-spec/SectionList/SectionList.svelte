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

<!-- SectionList.svelte -->
<ul
    class={`section-list ${className}`}


    {...restProps}
>
    {@render children?.()}
</ul>
