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

<!-- MockupPhonePortrait.svelte -->
<div class={`mockup-phone-portrait ${className}`} aria-label={label} {...restProps}>
    {@render children?.()}
</div>
