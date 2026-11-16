<script lang="ts">
    // TreeSelect component
    //
    // A select dropdown showing a tree of hierarchical options. Renders a
    // role="combobox" container with a trigger button and a tree panel.
    // Consumers manage expansion and selection state.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the combobox.
    //   expanded — boolean, default false. Whether the tree panel is open.
    //   disabled — boolean, default false.
    //   multiple — boolean, default false. Whether multiple selection is allowed.
    //   placeholder — string, optional.
    //   value — string, optional. Display value.
    //   onclick — (event: MouseEvent) => void, optional. Trigger click handler.
    //   children — Snippet, optional. Tree content (typically TreeNav/TreeList).
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Accessibility:
    //   - role="combobox" with aria-haspopup="tree", aria-expanded, aria-label,
    //     data-multiple="true" when multiple=true (aria-multiselectable is not
    //     valid on a combobox; the consumer's role="tree" carries it).
    //   - Trigger is a native <button>.
    //
    // Internationalization:
    //   - label, placeholder, value all come through props.
    //
    // Claude rules:
    //   - Headless: no styles.
    //   - label is REQUIRED.
    //
    // References:
    //   - Ant Design TreeSelect: https://ant.design/components/tree-select
    //   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

    import type { Snippet } from "svelte";
    import { attachTreePopup, type TreeSelection } from "../widget-keys";

    import { popoverState } from "../Popover/popover.js";

    let {
        class: className = "",
        label,
        expanded = $bindable(false),
        onSelect = undefined,
        disabled = false,
        multiple = false,
        placeholder = undefined,
        value = undefined,
        onclick = undefined,
        children = undefined,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Accessible label (REQUIRED) */
        label: string;
        /** Whether the tree panel is open */
        expanded?: boolean;
        /** Called with the chosen item, its path and every selected value */
        onSelect?: (selection: TreeSelection) => void;
        /** Whether the trigger is disabled */
        disabled?: boolean;
        /** Whether multiple selection is allowed */
        multiple?: boolean;
        /** Placeholder text on the trigger */
        placeholder?: string;
        /** Display value */
        value?: string;
        /** Trigger click handler */
        onclick?: (event: MouseEvent) => void;
        /** Tree content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    let rootEl = $state<HTMLElement>();

    $effect(() =>
        rootEl
            ? attachTreePopup(rootEl, {
                  onOpen: (open) => (expanded = open),
                  onSelect: (selection) => onSelect?.(selection),
              })
            : undefined,
    );
</script>

<!-- TreeSelect.svelte -->
<div
    bind:this={rootEl}
    class={`tree-select ${className}`}
    data-multiple={multiple || undefined}
    {...restProps}
>
    <!-- svelte-ignore a11y_role_has_required_aria_props (attachTreePopup sets aria-controls on mount: it gives the panel its id) -->
    <button
        class="tree-select-trigger"
        type="button"
        role="combobox"
        aria-haspopup="tree"
        aria-expanded={expanded}
        aria-label={label}
        {disabled}
        {onclick}
    >
        {value ?? placeholder ?? ""}
    </button>
    <div
        class="tree-select-panel"
        popover="manual"
        use:popoverState={expanded}
    >
        {#if children}{@render children?.()}{/if}
    </div>
</div>
