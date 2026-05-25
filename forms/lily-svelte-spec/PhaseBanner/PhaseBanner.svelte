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

<!-- PhaseBanner.svelte -->
<div
    class={`phase-banner ${className}`}

    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
