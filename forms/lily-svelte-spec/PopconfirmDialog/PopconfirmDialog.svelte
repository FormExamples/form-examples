<script lang="ts">
    // PopconfirmDialog component
    //
    // A popover dialog with confirm and cancel buttons. Renders an alertdialog
    // with required title and button labels. Generates stable id values for
    // aria-labelledby and aria-describedby.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   open — boolean, default false. Whether the dialog is open.
    //   title — string, REQUIRED. Dialog heading text.
    //   description — string, optional. Body text.
    //   confirmLabel — string, REQUIRED. Confirm button text.
    //   cancelLabel — string, REQUIRED. Cancel button text.
    //   onconfirm — (event: MouseEvent) => void, optional.
    //   oncancel — (event: MouseEvent) => void, optional.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <PopconfirmDialog
    //     open={isOpen}
    //     title="Delete this item?"
    //     description="This cannot be undone."
    //     confirmLabel="Delete"
    //     cancelLabel="Cancel"
    //     onconfirm={confirm}
    //     oncancel={cancel}
    //   />
    //
    // Accessibility:
    //   - role="alertdialog" with aria-labelledby (title), aria-describedby
    //     (description, when present), and aria-modal="false" (popconfirm is
    //     not modal).
    //
    // Internationalization:
    //   - All user-facing strings come through props.
    //
    // Claude rules:
    //   - Headless: no styles.
    //   - title, confirmLabel, cancelLabel are REQUIRED.
    //   - id values are generated via crypto.randomUUID for stability.
    //
    // References:
    //   - Ant Design Popconfirm: https://ant.design/components/popconfirm
    //   - WAI-ARIA Alert and Message Dialogs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

    let {
        class: className = "",
        open = false,
        title,
        description = undefined,
        confirmLabel,
        cancelLabel,
        onconfirm = undefined,
        oncancel = undefined,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Whether the dialog is open */
        open?: boolean;
        /** Dialog heading text (REQUIRED) */
        title: string;
        /** Body text */
        description?: string;
        /** Confirm button label (REQUIRED) */
        confirmLabel: string;
        /** Cancel button label (REQUIRED) */
        cancelLabel: string;
        /** Confirm handler */
        onconfirm?: (event: MouseEvent) => void;
        /** Cancel handler */
        oncancel?: (event: MouseEvent) => void;
        [key: string]: unknown;
    } = $props();

    // Generate stable ids for aria-labelledby and aria-describedby. Using
    // crypto.randomUUID once at component initialization keeps the ids stable
    // for the lifetime of this component instance.
    function makeId(prefix: string): string {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return `${prefix}-${crypto.randomUUID()}`;
        }
        return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
    }

    const titleId = makeId("popconfirm-dialog-title");
    const descId = makeId("popconfirm-dialog-description");
</script>

<!-- PopconfirmDialog.svelte -->
<div
    class={`popconfirm-dialog ${className}`}
    role="alertdialog"
    aria-modal="false"
    aria-labelledby={titleId}
    aria-describedby={description ? descId : undefined}
    hidden={!open}
    {...restProps}
>
    <h2 class="popconfirm-dialog-title" id={titleId}>{title}</h2>
    {#if description}
        <p class="popconfirm-dialog-description" id={descId}>{description}</p>
    {/if}
    <button
        class="popconfirm-dialog-cancel"
        type="button"
        onclick={oncancel}
    >
        {cancelLabel}
    </button>
    <button
        class="popconfirm-dialog-confirm"
        type="button"
        onclick={onconfirm}
    >
        {confirmLabel}
    </button>
</div>
