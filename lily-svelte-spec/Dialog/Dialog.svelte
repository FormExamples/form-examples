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

    import type { Snippet } from "svelte";

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

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            open = false;
        }
    }
</script>

<!-- Dialog.svelte -->
{#if open}
    <dialog
        class={`dialog ${className}`}
        open
        tabindex="-1"
        aria-label={label}
        aria-modal={modal || undefined}
        {onkeydown}
        {...restProps}
    >
        {@render children?.()}
    </dialog>
{/if}
