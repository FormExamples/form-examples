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

<!-- SuccessPanel.svelte -->
<div
    class={`success-panel ${className}`}
    role="status"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
