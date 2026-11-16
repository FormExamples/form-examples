<script lang="ts">
    // ShowMore component
    //
    // A headless "show more / show less" toggle for long content. The content
    // stays in the accessibility tree at all times; collapsing is a visual clamp
    // the consumer applies in CSS keyed on data-expanded. (Use Expander when the
    // content should be removed from the DOM while collapsed.)
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   moreLabel — string, required. Button text while collapsed. No default.
    //   lessLabel — string, required. Button text while expanded. No default.
    //   expanded — boolean, default false. Bindable.
    //   children — Snippet. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Keyboard:
    //   - Enter / Space on the native button toggles
    //
    // Accessibility:
    //   - button aria-expanded + aria-controls pointing at the content id
    //
    // Claude rules:
    //   - Headless: no inline style; the clamp is consumer CSS on [data-expanded="false"]
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        moreLabel,
        lessLabel,
        expanded = $bindable(false),
        children,
        ...restProps
    }: {
        /** Button text while collapsed. */
        moreLabel: string;
        /** Button text while expanded. */
        lessLabel: string;
        /** Whether the content is expanded. Bindable. */
        expanded?: boolean;
        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const uid = $props.id();
    const contentId = `show-more-${uid}`;
</script>

<!-- ShowMore.svelte -->
<div
    class={`show-more ${className}`}
    {...restProps}
>
    <div
        class="show-more-content"
        id={contentId}
        data-expanded={expanded}
    >
        {@render children?.()}
    </div>
    <button
        type="button"
        class="show-more-button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onclick={() => (expanded = !expanded)}
    >
        {expanded ? lessLabel : moreLabel}
    </button>
</div>
