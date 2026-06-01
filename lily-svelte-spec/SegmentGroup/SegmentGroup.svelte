<script lang="ts">
    // SegmentGroup component
    //
    // A headless segmented control group that uses the ARIA radiogroup role to
    // contain a set of mutually exclusive options. Renders a <div> with
    // role="radiogroup" and expects children to be SegmentGroupItem buttons
    // (or buttons with role="radio" and aria-checked). Used for view mode toggles,
    // filter selections, display density controls, and similar single-select UIs.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the segment group via aria-label.
    //   children — Snippet, required. Segment button elements to render inside the group.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <SegmentGroup label="View">
    //     <button role="radio" aria-checked="true">Grid</button>
    //     <button role="radio" aria-checked="false">List</button>
    //   </SegmentGroup>
    //
    // Examples:
    //   <!-- With SegmentGroupItem children -->
    //   <SegmentGroup label="Display mode">
    //     <SegmentGroupItem checked={mode === 'grid'} value="grid">Grid</SegmentGroupItem>
    //     <SegmentGroupItem checked={mode === 'list'} value="list">List</SegmentGroupItem>
    //   </SegmentGroup>
    //
    // Keyboard:
    //   - Tab: moves focus into the segment group
    //   - Arrow Left/Right: consumer should implement navigation between segments
    //   - Space/Enter: consumer should implement activation of the focused segment
    //
    // Accessibility:
    //   - role="radiogroup" identifies the container as mutually exclusive radio-like options
    //   - aria-label provides an accessible name for the group
    //   - Children should use role="radio" and aria-checked attributes
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer manages selection state (toggling aria-checked on children)
    //   - Compound component: use with SegmentGroupItem
    //
    // References:
    //   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Segment elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SegmentGroup.svelte -->
<div
    class={`segment-group ${className}`}
    role="radiogroup"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
