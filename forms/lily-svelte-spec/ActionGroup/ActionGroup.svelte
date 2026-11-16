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
    import { attachToolbar } from "../widget-keys";
    import { popoverState, popoverSupported, toggleOpened } from "../Popover/popover.js";

    let {
        class: className = "",
        label,
        overflowOpen = $bindable(false),
        overflowLabel = undefined,
        onOverflowToggle = undefined,
        children = undefined,
        overflow = undefined,
        ...restProps
    }: {
        class?: string;
        /** Accessible label for the group (REQUIRED) */
        label: string;
        /** Whether the overflow menu is open. Bindable: the browser opens and light-dismisses it. */
        overflowOpen?: boolean;
        /** Accessible label for the overflow trigger button */
        overflowLabel?: string;
        /** Click handler for the overflow trigger; call preventDefault() on the event to keep the menu as it is */
        onOverflowToggle?: (event: MouseEvent) => void;
        /** Visible action buttons */
        children?: Snippet;
        /** Overflow menu content */
        overflow?: Snippet;
        [key: string]: unknown;
    } = $props();

    const uid = $props.id();
    const menuId = `action-group-overflow-menu-${uid}`;
    let menu: HTMLDivElement | undefined = $state();

    // With the Popover API the trigger's command="toggle-popover" opens and closes the menu and the toggle event
    // writes `overflowOpen` back; without it, the click toggles `overflowOpen` and popoverState sets `hidden`.
    function toggle(event: MouseEvent) {
        onOverflowToggle?.(event);
        if (event.defaultPrevented) return;
        if (menu && !popoverSupported(menu)) overflowOpen = !overflowOpen;
    }

    let rootEl = $state<HTMLElement>();

    $effect(() => (rootEl ? attachToolbar(rootEl) : undefined));
</script>

<!-- ActionGroup.svelte -->
<div
    bind:this={rootEl}
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
            aria-controls={menuId}
            command="toggle-popover"
            commandfor={menuId}
            popovertarget={menuId}
            onclick={toggle}>…</button
        >
        <div
            bind:this={menu}
            class="action-group-overflow-menu"
            id={menuId}
            popover="auto"
            use:popoverState={overflowOpen}
            ontoggle={(event) => (overflowOpen = toggleOpened(event))}
        >
            {@render overflow()}
        </div>
    {/if}
</div>
