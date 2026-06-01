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

<!-- BarChart.svelte -->
<figure
    class={`bar-chart ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</figure>
