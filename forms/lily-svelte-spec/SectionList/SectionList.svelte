<script lang="ts">
    // SectionList component
    //
    // A list of sections. Renders a <ul> with the `section-list` hook; items are SectionListItem.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accepted for API symmetry but not rendered by this component.
    //   children — Snippet, required. The SectionListItem children.
    //   ...restProps — additional HTML attributes spread onto the root <ul>.
    //
    // Syntax:
    //   <SectionList>…</SectionList>
    //
    // Examples:
    //   <SectionList><SectionListItem><a href="#one">One</a></SectionListItem></SectionList>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - `label` is not rendered; name the element through restProps (aria-label or aria-labelledby) if it needs one
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <ul>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul

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

<!-- SectionList.svelte -->
<ul
    class={`section-list ${className}`}
    {...restProps}
>
    {@render children?.()}
</ul>
