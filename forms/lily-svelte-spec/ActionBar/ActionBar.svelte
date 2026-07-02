<script lang="ts">
    // ActionBar component
    //
    // A contextual action bar that appears when items are selected, showing
    // the selection count and bulk action buttons. Renders a `<div>` with
    // `role="toolbar"`. The selected count label is consumer-formatted for
    // i18n (e.g., "3 selected"). When both `clearSelectionLabel` and
    // `onClearSelection` are provided, a clear-selection button is rendered.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the toolbar.
    //   selectedCount — number, REQUIRED. Count of currently selected items.
    //   selectedCountLabel — string, REQUIRED. Pre-formatted count display.
    //   clearSelectionLabel — string, optional. Accessible label for clear.
    //   onClearSelection — () => void, optional. Clear-selection click handler.
    //   children — Snippet, optional. Action button children.
    //
    // Syntax:
    //   <ActionBar
    //       label="Bulk actions"
    //       selectedCount={3}
    //       selectedCountLabel="3 selected"
    //       clearSelectionLabel="Clear selection"
    //       onClearSelection={handleClear}
    //   >
    //       <ActionBarButton label="Delete">Delete</ActionBarButton>
    //   </ActionBar>
    //
    // Keyboard:
    //   - Tab: Move focus through toolbar buttons
    //
    // Accessibility:
    //   - role="toolbar" with aria-label
    //   - data-selected-count exposes the count for consumer styling
    //
    // Internationalization:
    //   - All user-facing text comes through props
    //
    // References:
    //   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        selectedCount,
        selectedCountLabel,
        clearSelectionLabel = undefined,
        onClearSelection = undefined,
        children = undefined,
        ...restProps
    }: {
        class?: string;
        /** Accessible label for the toolbar (REQUIRED) */
        label: string;
        /** Count of currently selected items (REQUIRED) */
        selectedCount: number;
        /** Pre-formatted display of the count (REQUIRED) */
        selectedCountLabel: string;
        /** Accessible label for the clear-selection button */
        clearSelectionLabel?: string;
        /** Clear-selection click handler */
        onClearSelection?: () => void;
        /** Action button children */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const showClear = $derived(
        Boolean(clearSelectionLabel) && typeof onClearSelection === "function",
    );
</script>

<!-- ActionBar.svelte -->
<div
    class={`action-bar ${className}`}
    role="toolbar"
    aria-label={label}
    data-selected-count={selectedCount}
    {...restProps}
>
    <span class="action-bar-count">{selectedCountLabel}</span>
    {#if children}
        {@render children?.()}
    {/if}
    {#if showClear}
        <button
            class="action-bar-clear"
            type="button"
            aria-label={clearSelectionLabel}
            onclick={onClearSelection}
        >×</button>
    {/if}
</div>
