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

<!-- DocumentList.svelte -->
<ul
    class={`document-list ${className}`}

    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ul>
