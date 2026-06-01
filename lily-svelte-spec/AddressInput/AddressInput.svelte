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

<!-- AddressInput.svelte -->
<div
    class={`address-input ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
