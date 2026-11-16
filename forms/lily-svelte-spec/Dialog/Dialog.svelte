<script lang="ts">
    // Dialog component
    //
    // A modal or non-modal dialog that overlays the main interface to communicate
    // information or prompt users for input. Uses the native <dialog> element with
    // conditional rendering. Common use cases include confirmations, alerts, forms,
    // settings, and any interaction requiring focused user attention.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   open — boolean, default false. Whether the dialog is visible; bindable.
    //   label — string, required. Accessible name for the dialog.
    //   modal — boolean, default true. Whether the dialog behaves as a modal.
    //   children — Snippet, required. Dialog body content.
    //   ...restProps — additional HTML attributes spread onto the <dialog> element.
    //
    // Syntax:
    //   <Dialog label="Confirm" bind:open>Content here</Dialog>
    //
    // Examples:
    //   <!-- Confirmation dialog -->
    //   <Dialog label="Confirm action" bind:open={showDialog}>
    //     <p>Are you sure you want to proceed?</p>
    //     <button onclick={() => showDialog = false}>Cancel</button>
    //     <button onclick={() => { handleConfirm(); showDialog = false; }}>Confirm</button>
    //   </Dialog>
    //
    //   <!-- Non-modal dialog -->
    //   <Dialog label="Notification" bind:open={showNotice} modal={false}>
    //     <p>Your file has been saved.</p>
    //   </Dialog>
    //
    // Keyboard:
    //   - Escape: closes the dialog by setting open to false
    //
    // Accessibility:
    //   - role="dialog" provided natively by the <dialog> element
    //   - aria-label provides the accessible name
    //   - aria-modal="true" when modal prop is true, indicating focus trap
    //   - tabindex="-1" allows the dialog to receive focus for keyboard events
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable() on open for two-way state binding
    //   - Dialog is removed from DOM entirely when open is false
    //   - Uses open HTML attribute directly, not .showModal()
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
    //   - MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
    //   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import { modalDialog } from "./modal.js";

    let {
        class: className = "",
        open = $bindable(false),
        label,
        modal = true,
        children,
        ...restProps
    }: {
        /** Whether the dialog is visible. Bindable. */
        open?: boolean;
        /** Accessible name for the dialog. */
        label: string;
        /** Whether the dialog is modal. */
        modal?: boolean;
        /** Dialog content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Dialog", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && !event.defaultPrevented) {
            event.preventDefault();
            open = false;
        }
    }
    function oncancel(event: Event) {
        event.preventDefault();
        open = false;
    }
    function onclose() {
        open = false;
    }
</script>

<!-- Dialog.svelte -->
{#if open}
    <!-- A modal dialog is opened by `showModal()` (see modal.ts), so the `open` attribute is only rendered for a
         non-modal one; the keydown and cancel handlers keep `open` in step with a native Escape or `<form method="dialog">`. -->
    <dialog
        class={`dialog ${className}`}
        open={modal ? undefined : true}
        tabindex="-1"
        aria-label={label}
        aria-modal={modal || undefined}
        use:modalDialog={modal}
        {onkeydown}
        {oncancel}
        {onclose}
        {...restProps}
    >
        {@render children?.()}
    </dialog>
{/if}
