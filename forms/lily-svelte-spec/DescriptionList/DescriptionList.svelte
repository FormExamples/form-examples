<script lang="ts">
    // DescriptionList component
    //
    // A list of terms and their descriptions. Renders a <dl> with the `description-list` hook; items are
    // DescriptionListItem (a <div> wrapping each dt/dd group).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accepted for API symmetry but not rendered by this component.
    //   children — Snippet, required. The DescriptionListItem children.
    //   ...restProps — additional HTML attributes spread onto the root <dl>.
    //
    // Syntax:
    //   <DescriptionList>…</DescriptionList>
    //
    // Examples:
    //   <DescriptionList><DescriptionListItem><dt>Term</dt><dd>Description</dd></DescriptionListItem></DescriptionList>
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
    //   - MDN <dl>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

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

<!-- DescriptionList.svelte -->
<dl
    class={`description-list ${className}`}
    {...restProps}
>
    {@render children?.()}
</dl>
