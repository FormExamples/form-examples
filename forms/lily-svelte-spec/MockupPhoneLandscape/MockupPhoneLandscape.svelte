<script lang="ts">
    // MockupPhoneLandscape component
    // A box area that looks like a mobile phone in landscape orientation.

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- MockupPhoneLandscape.svelte -->
<div
    class={`mockup-phone-landscape ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
