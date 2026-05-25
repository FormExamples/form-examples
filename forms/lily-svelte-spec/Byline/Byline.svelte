<script lang="ts">
    // Byline component
    //
    // Author attribution with optional publish and update timestamps.
    // Renders a <div> containing the authors (children Snippet) plus two
    // optional snippets — `published` and `updated` — that the consumer
    // fills with <time> elements.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Use rel="author" on author links

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        published = undefined,
        updated = undefined,
        children,
        ...restProps
    }: {
        published?: Snippet;
        updated?: Snippet;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Byline.svelte -->
<div class={`byline ${className}`} {...restProps}>
    <span class="byline-authors">{@render children?.()}</span>
    {#if published}
        <span class="byline-published">{@render published()}</span>
    {/if}
    {#if updated}
        <span class="byline-updated">{@render updated()}</span>
    {/if}
</div>
