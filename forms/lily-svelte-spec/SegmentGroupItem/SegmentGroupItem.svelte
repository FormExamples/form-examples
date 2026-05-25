<script lang="ts">
    // SegmentGroupItem component
    //
    // A single segment option within a SegmentGroup (role="radiogroup"). Renders
    // as a <button> with role="radio" and aria-checked to indicate selection state.
    // Uses roving tabindex so only the checked item receives tab focus. Used inside
    // SegmentGroup to build custom segmented controls like view mode toggles.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   checked — boolean, default false. Whether this segment is currently selected.
    //   value — string, default "". Value associated with this segment, exposed as data-value.
    //   disabled — boolean, default false. Whether the segment is disabled.
    //   children — Snippet, required. Label content to render inside the button.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <SegmentGroupItem checked={true} value="grid">Grid</SegmentGroupItem>
    //
    // Examples:
    //   <!-- Inside a SegmentGroup with click handlers -->
    //   <SegmentGroup label="View">
    //     <SegmentGroupItem checked={mode === 'grid'} value="grid" onclick={() => mode = 'grid'}>Grid</SegmentGroupItem>
    //     <SegmentGroupItem checked={mode === 'list'} value="list" onclick={() => mode = 'list'}>List</SegmentGroupItem>
    //   </SegmentGroup>
    //
    // Keyboard:
    //   - Tab: focus moves to the checked segment (roving tabindex)
    //   - Space/Enter: activates the focused segment (native button behavior)
    //   - Arrow Left/Right: consumer should implement on the parent SegmentGroup
    //
    // Accessibility:
    //   - role="radio" identifies this button as a radio-like option within a radiogroup
    //   - aria-checked indicates whether this segment is selected (true/false)
    //   - Roving tabindex: checked item has tabindex="0", others have tabindex="-1"
    //   - data-value exposes the segment value for CSS or JS queries
    //
    // Internationalization:
    //   - Label content comes through the children snippet for localization
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: must be used inside a SegmentGroup
    //   - Consumer manages selection state and click/keyboard handlers
    //
    // References:
    //   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        checked = false,
        value = "",
        disabled = false,
        children,
        ...restProps
    }: {
        /** Whether this segment is selected. */
        checked?: boolean;
        /** Value associated with this segment. */
        value?: string;
        /** Whether this segment is disabled. */
        disabled?: boolean;
        /** Label content for the segment. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SegmentGroupItem.svelte -->
<button
    class={`segment-group-item ${className}`}
    role="radio"
    aria-checked={checked}
    data-value={value}
    tabindex={checked ? 0 : -1}
    {disabled}
    {...restProps}
>
    {@render children?.()}
</button>
