<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = "End notes",
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- EndNotes.svelte -->
<section
    class={`end-notes ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</section>
