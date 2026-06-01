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

<!-- Autosuggest.svelte -->
<div
    class={`autosuggest ${className}`}
    role="combobox"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
