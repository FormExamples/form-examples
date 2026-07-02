<script lang="ts">
    // GraphicBlock component
    //
    // A wrapper for charts and graphics. Renders <figure role="img"> with
    // aria-label so the whole graphic announces as a single image, and
    // gathers title + description + notes inside a <figcaption> when any
    // are provided.

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        title = undefined,
        description = undefined,
        notes = undefined,
        children,
        ...restProps
    }: {
        label: string;
        title?: string;
        description?: string;
        notes?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let hasCaption = $derived(
        title !== undefined || description !== undefined || notes !== undefined
    );
</script>

<!-- GraphicBlock.svelte -->
<figure
    class={`graphic-block ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {#if hasCaption}
        <figcaption class="graphic-block-caption">
            {#if title !== undefined}
                <div class="graphic-block-title">{title}</div>
            {/if}
            {#if description !== undefined}
                <div class="graphic-block-description">{description}</div>
            {/if}
            {#if notes !== undefined}
                <div class="graphic-block-notes">{notes}</div>
            {/if}
        </figcaption>
    {/if}
    <div class="graphic-block-content">{@render children?.()}</div>
</figure>
