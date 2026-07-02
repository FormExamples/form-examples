<script lang="ts">
    // ActionGroup component
    //
    // A group of action buttons that can collapse to an overflow menu when
    // space is constrained. Renders a `<div>` with `role="group"`. When the
    // optional `overflow` snippet is provided, an overflow trigger button and
    // overflow menu container are also rendered.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the group.
    //   overflowOpen — boolean, default false. Whether overflow menu is open.
    //   overflowLabel — string, optional. aria-label for the overflow trigger.
    //   onOverflowToggle — () => void, optional. Trigger click handler.
    //   children — Snippet, optional. Visible action buttons.
    //   overflow — Snippet, optional. Overflow menu content.
    //
    // Syntax:
    //   <ActionGroup label="Toolbar" {overflowOpen} onOverflowToggle={toggle}>
    //       {#snippet overflow()}<Menu>…</Menu>{/snippet}
    //       <button>Cut</button>
    //       <button>Copy</button>
    //   </ActionGroup>
    //
    // Accessibility:
    //   - role="group" with aria-label
    //   - overflow trigger has aria-haspopup="menu" and aria-expanded
    //
    // Internationalization:
    //   - All user-facing text via props
    //
    // References:
    //   - Adobe Spectrum ActionGroup: https://spectrum.adobe.com/page/action-group/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        overflowOpen = false,
        overflowLabel = undefined,
        onOverflowToggle = undefined,
        children = undefined,
        overflow = undefined,
        ...restProps
    }: {
        class?: string;
        /** Accessible label for the group (REQUIRED) */
        label: string;
        /** Whether the overflow menu is open */
        overflowOpen?: boolean;
        /** Accessible label for the overflow trigger button */
        overflowLabel?: string;
        /** Click handler for the overflow trigger */
        onOverflowToggle?: () => void;
        /** Visible action buttons */
        children?: Snippet;
        /** Overflow menu content */
        overflow?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ActionGroup.svelte -->
<div
    class={`action-group ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
    {#if overflow}
        <button
            class="action-group-overflow-trigger"
            type="button"
            aria-haspopup="menu"
            aria-expanded={overflowOpen}
            aria-label={overflowLabel}
            onclick={onOverflowToggle}
        >…</button>
        <div class="action-group-overflow-menu" hidden={!overflowOpen}>
            {@render overflow()}
        </div>
    {/if}
</div>
