<script lang="ts">
    // Cascader component
    //
    // A multi-level dropdown for selecting a value from a hierarchy. The headless
    // implementation renders a combobox container with a trigger button and a
    // panel that consumers fill with nested option lists. Consumers control
    // expansion and selection state.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the combobox.
    //   expanded — boolean, default false. Whether the panel is open.
    //   disabled — boolean, default false.
    //   placeholder — string, optional. Placeholder text on the trigger button.
    //   value — string, optional. Display value (consumer formats path).
    //   onclick — (event: MouseEvent) => void, optional. Trigger click handler.
    //   children — Snippet, optional. Panel content (typically nested option lists).
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Cascader label="Region" expanded={open} value={path} onclick={toggle}>
    //     {#snippet children()}…{/snippet}
    //   </Cascader>
    //
    // Accessibility:
    //   - role="combobox" with aria-haspopup="tree", aria-expanded, aria-label.
    //   - Trigger is a native <button> for keyboard support.
    //
    // Internationalization:
    //   - label, placeholder, and value all come through props.
    //
    // Claude rules:
    //   - Headless: no styles, no internal state.
    //   - label is REQUIRED.
    //
    // References:
    //   - Ant Design Cascader: https://ant.design/components/cascader
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
        /** Whether the panel is open */
        expanded?: boolean;
        /** Called with the chosen item, its path and every selected value */
        onSelect?: (selection: TreeSelection) => void;
        /** Whether the cascader is disabled */
        disabled?: boolean;
        /** Placeholder text on the trigger when no value is selected */
        placeholder?: string;
        /** Display value (consumer formats path) */
        value?: string;
        /** Trigger click handler */
        onclick?: (event: MouseEvent) => void;
        /** Panel content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    let rootEl = $state<HTMLElement>();

    $effect(() =>
        rootEl
            ? attachTreePopup(rootEl, {
                  exclusive: true,
                  onOpen: (open) => (expanded = open),
                  onSelect: (selection) => onSelect?.(selection),
              })
            : undefined,
    );
</script>

<!-- Cascader.svelte -->
<div
    bind:this={rootEl}
    class={`cascader ${className}`}
    {...restProps}
>
    <!-- svelte-ignore a11y_role_has_required_aria_props (attachTreePopup sets aria-controls on mount: it gives the panel its id) -->
    <button
        class="cascader-trigger"
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
        class="cascader-panel"
        popover="manual"
        use:popoverState={expanded}
    >
        {#if children}{@render children?.()}{/if}
    </div>
</div>
