<script lang="ts">
    // SectionListItem component
    //
    // One item in a SectionList. Renders an <li> with the `section-list-item` hook; `current` is exposed
    // as data-current for CSS, not as aria-current.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   current — boolean, default false. Sets an empty data-current attribute when true.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <li>.
    //
    // Syntax:
    //   <SectionListItem current>…</SectionListItem>
    //
    // Examples:
    //   <SectionListItem current><a href="#one" aria-current="location">One</a></SectionListItem>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - `current` is a styling hook only; put aria-current on the link inside the item for assistive technology
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - data-* is for consumer CSS, ARIA is for assistive technology
    //
    // References:
    //   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        current = false,
        children,
        ...restProps
    }: {
        current?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SectionListItem.svelte -->
<li
    class={`section-list-item ${className}`}
    data-current={current ? "" : undefined}
    {...restProps}
>
    {@render children?.()}
</li>
