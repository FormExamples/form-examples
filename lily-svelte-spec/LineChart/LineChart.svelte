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

<!-- LineChart.svelte -->
<figure
    class={`line-chart ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</figure>
