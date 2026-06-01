<script lang="ts">
    // AlertDialog component
    //
    // A headless modal alert dialog for critical interactions that require user
    // acknowledgment before continuing. Uses the native HTML <dialog> element
    // with the ARIA alertdialog role. Distinguished from regular Dialog by the
    // alertdialog role, which signals to assistive technologies that the content
    // requires immediate attention.
    //
    // Common uses: confirming irreversible actions ("Delete this item?"),
    // warning about unsaved changes, or displaying critical error messages.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   open        — boolean, default false, bindable. Whether the dialog is visible.
    //   title       — string, required. Dialog heading, referenced by aria-labelledby.
    //   description — string, optional. Dialog message, referenced by aria-describedby.
    //   children    — Snippet, required. Action buttons and additional content.
    //   ...restProps — additional HTML attributes spread onto <dialog>.
    //
    // Syntax:
    //   <AlertDialog bind:open title="Confirm" description="Are you sure?">
    //     <button>Yes</button>
    //     <button>No</button>
    //   </AlertDialog>
    //
    // Examples:
    //   <!-- Confirmation dialog with description -->
    //   <AlertDialog bind:open={showDialog} title="Confirm Deletion"
    //     description="This action cannot be undone.">
    //     <button onclick={handleConfirm}>Yes, delete</button>
    //     <button onclick={handleCancel}>Cancel</button>
    //   </AlertDialog>
    //
    //   <!-- Simple acknowledgment dialog -->
    //   <AlertDialog bind:open={showAlert} title="Session Expired">
    //     <button onclick={() => showAlert = false}>OK</button>
    //   </AlertDialog>
    //
    // Keyboard:
    //   - Escape: Consumer must implement via onkeydown to close the dialog
    //   - Tab: Consumer should implement focus trapping within the dialog
    //
    // Accessibility:
    //   - role="alertdialog" signals critical content requiring acknowledgment
    //   - aria-modal="true" indicates modal behavior to assistive technologies
    //   - aria-labelledby references the title element
    //   - aria-describedby references the description element (when present)
    //   - Conditionally rendered with {#if open} to remove from DOM when closed
    //
    // Internationalization:
    //   - Title and description come through props
    //   - Action buttons come through children snippet
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer is responsible for focus trapping and Escape key handling
    //   - The open prop must use $bindable() for two-way binding
    //   - Do not use heading elements; use <p><strong> for the title
    //   - Distinct from Dialog: use AlertDialog only for critical messages
    //
    // References:
    //   - WAI-ARIA alertdialog role: https://www.w3.org/TR/wai-aria-1.2/#alertdialog
    //   - WAI-ARIA Alert and Message Dialogs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        open = $bindable(false),
        title,
        description = undefined,
        children,
        ...restProps
    }: {
        /** Whether the dialog is visible */
        open?: boolean;
        /** The dialog title for the heading and aria-labelledby */
        title: string;
        /** The dialog description/message for aria-describedby */
        description?: string;
        /** The dialog action buttons and content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    // Generate unique IDs for ARIA references so multiple instances don't collide
    let uid = $props.id();
    let titleId = `alert-dialog-title-${uid}`;
    let descriptionId = `alert-dialog-description-${uid}`;
</script>

<!-- AlertDialog.svelte -->
{#if open}
    <dialog
        class={`alert-dialog ${className}`}
        open
        role="alertdialog"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-modal="true"
        {...restProps}
    >
        <div>
            <p id={titleId}><strong>{title}</strong></p>
            {#if description}
                <p id={descriptionId}>{description}</p>
            {/if}
            {@render children?.()}
        </div>
    </dialog>
{/if}
