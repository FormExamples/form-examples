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

<!-- ColumnChart.svelte -->
<figure
    class={`column-chart ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</figure>
