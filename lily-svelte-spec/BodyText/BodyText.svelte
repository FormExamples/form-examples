<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- BodyText.svelte -->
<div
    class={`body-text ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
