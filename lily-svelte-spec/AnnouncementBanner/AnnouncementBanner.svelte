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

<!-- AnnouncementBanner.svelte -->
<div
    class={`announcement-banner ${className}`}
    role="region"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
