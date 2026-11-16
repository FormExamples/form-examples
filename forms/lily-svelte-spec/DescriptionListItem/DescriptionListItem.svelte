<script lang="ts">
    // DescriptionListItem component
    //
    // One term-and-description group inside a DescriptionList. A <div> is the only element HTML allows to
    // wrap dt/dd pairs in a <dl>.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. The <dt> and <dd> elements.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <DescriptionListItem>…</DescriptionListItem>
    //
    // Examples:
    //   <DescriptionListItem><dt>Name</dt><dd>Sam</dd></DescriptionListItem>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - Native semantics only; name the element through restProps (aria-labelledby) only if it needs one
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <dl>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DescriptionListItem.svelte -->
<div
    class={`description-list-item ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
