<script lang="ts">
    // Skeleton component
    //
    // A headless loading placeholder that indicates content is in the process of
    // loading. Shows the approximate layout of content before it arrives, reducing
    // perceived loading time and preventing layout shift. Hidden from screen readers
    // with aria-hidden="true" and signals loading state with aria-busy="true".
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, optional. Placeholder content such as skeleton line shapes.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Skeleton />
    //
    // Examples:
    //   <!-- With placeholder shapes -->
    //   <Skeleton>
    //     <div class="skeleton-line"></div>
    //     <div class="skeleton-line"></div>
    //   </Skeleton>
    //
    //   <!-- With sizing attributes -->
    //   <Skeleton style="width:200px; height:20px;" />
    //
    // Keyboard:
    //   - None — this is a passive placeholder hidden from interaction.
    //
    // Accessibility:
    //   - aria-hidden="true" hides the placeholder entirely from screen readers
    //   - aria-busy="true" signals that this region is in a loading state
    //   - Content will be replaced when loading completes
    //
    // Internationalization:
    //   - No user-facing text — purely a visual placeholder
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Children are optional — renders an empty div when no shapes are provided
    //   - Consumer applies skeleton animation and sizing via CSS
    //
    // References:
    //   - WAI-ARIA aria-busy: https://www.w3.org/WAI/ARIA/apd/states/aria-busy/
    //   - MDN aria-hidden: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** Optional placeholder content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Skeleton.svelte -->
<div
    class={`skeleton ${className}`}
    aria-hidden="true"
    aria-busy="true"
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</div>
