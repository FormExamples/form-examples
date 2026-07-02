<script lang="ts">
    // EditableForm component
    //
    // An editable form that wraps inline editing functionality in a <form> element,
    // providing submit and cancel semantics with keyboard support. The form is only
    // rendered when the editing prop is true. Useful for editing records in place,
    // such as updating profiles, renaming items, or modifying settings.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the form.
    //   editing — boolean, default false. Whether the form is in edit mode; bindable.
    //   onsubmit — (event: SubmitEvent) => void, default undefined. Callback when the form is submitted.
    //   oncancel — () => void, default undefined. Callback when editing is cancelled.
    //   children — Snippet, required. Form content (inputs, buttons, etc.).
    //   ...restProps — additional HTML attributes spread onto the <form> element.
    //
    // Syntax:
    //   <EditableForm label="Edit profile" bind:editing onsubmit={save}>
    //     <input name="name" />
    //     <button type="submit">Save</button>
    //   </EditableForm>
    //
    // Examples:
    //   <!-- Basic editable form -->
    //   <EditableForm label="Edit profile" bind:editing onsubmit={save}>
    //     <input name="name" value={name} />
    //     <button type="submit">Save</button>
    //   </EditableForm>
    //
    //   <!-- With cancel callback and cancel button -->
    //   <EditableForm label="Rename item" bind:editing onsubmit={rename} oncancel={revert}>
    //     <input name="title" value={title} />
    //     <button type="submit">OK</button>
    //     <button type="button" onclick={() => editing = false}>Cancel</button>
    //   </EditableForm>
    //
    // Keyboard:
    //   - Enter: submits the form (native behavior), exits edit mode, calls onsubmit
    //   - Escape: cancels editing, exits edit mode, calls oncancel
    //
    // Accessibility:
    //   - aria-label provides the accessible name for the form
    //   - tabindex="-1" allows programmatic focus management
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //   - All button and input labels come from consumer-provided children
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Form is removed from DOM when editing is false
    //   - Uses $bindable() on editing for two-way state binding
    //   - Calls event.preventDefault() on submit for consumer-controlled save logic
    //
    // References:
    //   - WAI-ARIA Form Role: https://www.w3.org/WAI/ARIA/apd/roles/form/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        editing = $bindable(false),
        onsubmit = undefined,
        oncancel = undefined,
        children,
        ...restProps
    }: {
        /** Accessible name for the form. */
        label: string;
        /** Whether the form is in edit mode. Bindable. */
        editing?: boolean;
        /** Called when form is submitted. */
        onsubmit?: (event: SubmitEvent) => void;
        /** Called when editing is cancelled. */
        oncancel?: () => void;
        /** Form content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        editing = false;
        onsubmit?.(event);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            editing = false;
            oncancel?.();
        }
    }
</script>

<!-- EditableForm.svelte -->
{#if editing}
    <form
        class={`editable-form ${className}`}
        aria-label={label}
        tabindex="-1"
        onsubmit={handleSubmit}
        onkeydown={handleKeydown}
        {...restProps}
    >
        {@render children?.()}
    </form>
{/if}
