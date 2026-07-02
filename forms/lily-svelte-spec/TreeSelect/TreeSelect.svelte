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
    //     aria-multiselectable when multiple=true.
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

    let {
        class: className = "",
        label,
        expanded = false,
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
</script>

<!-- TreeSelect.svelte -->
<div
    class={`tree-select ${className}`}
    role="combobox"
    aria-haspopup="tree"
    aria-expanded={expanded}
    aria-label={label}
    aria-multiselectable={multiple || undefined}
    {...restProps}
>
    <button
        class="tree-select-trigger"
        type="button"
        {disabled}
        {onclick}
    >
        {value ?? placeholder ?? ""}
    </button>
    <div class="tree-select-panel" hidden={!expanded}>
        {#if children}{@render children?.()}{/if}
    </div>
</div>
