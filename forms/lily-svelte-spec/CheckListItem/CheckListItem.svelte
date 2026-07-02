<script lang="ts">
    // CheckListItem component
    //
    // A single item within a CheckList. Renders as an <li> containing a
    // checkbox <input> and a <label> for the item text. Supports checked
    // and disabled states. Designed for use inside a CheckList <ol>.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   checked — boolean, default false. Whether the checkbox is checked.
    //   disabled — boolean, default false. Whether the checkbox is disabled.
    //   children — Snippet, required. The label content for this item.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <CheckListItem>Task one</CheckListItem>
    //
    // Examples:
    //   <!-- Checked item -->
    //   <CheckListItem checked>Create account</CheckListItem>
    //
    //   <!-- Disabled item -->
    //   <CheckListItem disabled>Locked step</CheckListItem>
    //
    // Keyboard:
    //   - Space: toggles the checkbox when focused
    //   - Tab: moves focus to the next focusable element
    //
    // Accessibility:
    //   - Native <input type="checkbox"> provides built-in accessibility
    //   - <label> wraps the checkbox and text for a larger click target
    //   - disabled attribute prevents interaction when set
    //
    // Internationalization:
    //   - Item text comes through children snippet; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a CheckList component (which provides the <ol>)
    //
    // References:
    //   - MDN checkbox: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        checked = false,
        disabled = false,
        children,
        ...restProps
    }: {
        /** Whether the checkbox is checked. */
        checked?: boolean;
        /** Whether the checkbox is disabled. */
        disabled?: boolean;
        /** Item label content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CheckListItem.svelte -->
<li class={`check-list-item ${className}`} {...restProps}>
    <label>
        <input
            type="checkbox"
            {checked}
            {disabled}
        />
        {@render children?.()}
    </label>
</li>
