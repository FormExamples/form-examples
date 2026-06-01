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

<!-- ScatterChart.svelte -->
<figure
    class={`scatter-chart ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</figure>
