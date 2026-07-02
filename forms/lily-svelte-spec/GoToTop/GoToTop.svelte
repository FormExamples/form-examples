<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        href = "#top",
        children,
        ...restProps
    }: {
        label?: string;
        href?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GoToTop.svelte -->
<a
    class={`go-to-top ${className}`}


    {href}
    {...restProps}
>
    {@render children?.()}
</a>
