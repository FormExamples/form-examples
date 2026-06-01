<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        status = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        status?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Draft.svelte -->
<div
    class={`draft ${className}`}
    aria-label={label}
    data-status={status}
    {...restProps}
>
    {@render children?.()}
</div>
