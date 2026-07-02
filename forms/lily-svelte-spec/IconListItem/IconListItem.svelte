<script lang="ts">
    // IconListItem component
    //
    // A headless `<li>` with an optional leading-icon slot and required text
    // content. The icon snippet renders inside an `aria-hidden="true"` span so
    // screen readers do not announce decorative glyphs; the textual content
    // remains the accessible name of the item.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   icon — Snippet, optional. Decorative leading icon.
    //   children — Snippet, required. Text content.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <IconListItem icon={iconSnippet}>Fast</IconListItem>
    //
    // Accessibility:
    //   - Icon span has aria-hidden="true" (decorative)
    //   - Text content is the accessible name
    //
    // Internationalization:
    //   - Text comes from children (consumer-supplied)
    //
    // Claude rules:
    //   - Headless: no styles
    //   - children is REQUIRED

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        icon = undefined,
        children,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Optional leading icon snippet (decorative) */
        icon?: Snippet;
        /** Item text content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- IconListItem.svelte -->
<li
    class={`icon-list-item ${className}`}
    {...restProps}
>
    {#if icon}
        <span class="icon-list-item-icon" aria-hidden="true">
            {@render icon()}
        </span>
    {/if}
    <span class="icon-list-item-text">
        {@render children?.()}
    </span>
</li>
