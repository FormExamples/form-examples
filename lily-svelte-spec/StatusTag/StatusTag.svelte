<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        type = "default",
        children,
        ...restProps
    }: {
        label?: string;
        type?: "default" | "info" | "success" | "warning" | "error";
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- StatusTag.svelte -->
<span
    class={`status-tag ${className}`}
    role="status"
    aria-label={label}
    data-type={type}
    {...restProps}
>
    {@render children?.()}
</span>
