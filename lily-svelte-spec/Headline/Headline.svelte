<script lang="ts">
    // Headline component
    //
    // A page or article headline composition: a heading at a configurable
    // level (default <h1>), with optional `subtitle` and `byline` snippets
    // rendered below it.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        level = 1,
        subtitle = undefined,
        byline = undefined,
        children,
        ...restProps
    }: {
        level?: 1 | 2 | 3 | 4 | 5 | 6;
        subtitle?: Snippet;
        byline?: Snippet;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Headline.svelte -->
<div class={`headline ${className}`} {...restProps}>
    {#if level === 1}
        <h1 class="headline-heading">{@render children?.()}</h1>
    {:else if level === 2}
        <h2 class="headline-heading">{@render children?.()}</h2>
    {:else if level === 3}
        <h3 class="headline-heading">{@render children?.()}</h3>
    {:else if level === 4}
        <h4 class="headline-heading">{@render children?.()}</h4>
    {:else if level === 5}
        <h5 class="headline-heading">{@render children?.()}</h5>
    {:else}
        <h6 class="headline-heading">{@render children?.()}</h6>
    {/if}
    {#if subtitle}
        <div class="headline-subtitle">{@render subtitle()}</div>
    {/if}
    {#if byline}
        <div class="headline-byline">{@render byline()}</div>
    {/if}
</div>
