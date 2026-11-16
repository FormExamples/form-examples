<script lang="ts">
    // ContentsLink component
    //
    // One table of contents link: an <a href> to a page section, with an optional count (for example
    // of tasks to do in that section).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   href — string, default "#". The link target.
    //   label — string, optional. aria-label override. It replaces the link's whole accessible name, so
    //     if you also show a count, include the count in it.
    //   count — number, optional. Sets data-count on the link (and data-complete when 0), as CSS hooks.
    //   countLabel — string, optional. Visible, localised count text (e.g. "3 to do"), rendered inside
    //     the link after the text so the link's accessible name includes it. No default, no English.
    //   children — Snippet, required. The link text.
    //   ...restProps — additional HTML attributes spread onto the <a>.
    //
    // Accessibility:
    //   - The count is text inside the link, never colour alone (WCAG 1.4.1).

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        href = "#",
        count = undefined,
        countLabel = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        href?: string;
        count?: number;
        countLabel?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ContentsLink.svelte -->
<a
    class={`contents-link ${className}`}
    {href}
    aria-label={label}
    data-count={count}
    data-complete={count === 0 ? "" : undefined}
    {...restProps}
>
    {@render children?.()}
    {#if countLabel}<span class="contents-link-count">{countLabel}</span>{/if}
</a>
