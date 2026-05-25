<script lang="ts">
    // Field component
    //
    // A form field wrapper that combines a label, description, and error message
    // with proper labelling via the for attribute and accessible error announcements.
    // Works with any input type: text inputs, selects, textareas, checkboxes, and
    // more. Auto-generates IDs for linking the label to its input and for associating
    // description and error elements via ARIA attributes.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Visible label text.
    //   description — string, default undefined. Helper text displayed below the label.
    //   error — string, default undefined. Error message displayed below the input.
    //   required — boolean, default false. Adds a visual asterisk (hidden from screen readers).
    //   inputId — string, default undefined. ID of the input to link the label to; auto-generated if omitted.
    //   children — Snippet, required. Form control (input, select, text-area-input, etc.).
    //   ...restProps — additional HTML attributes spread onto the outer <div>.
    //
    // Syntax:
    //   <Field label="Name"><input id="name-input" /></Field>
    //
    // Examples:
    //   <!-- Field with description -->
    //   <Field label="Name" description="Enter full name">
    //     <input id="name-input" />
    //   </Field>
    //
    //   <!-- Required field with error -->
    //   <Field label="Email" required error="Email is required">
    //     <input id="email-input" type="email" />
    //   </Field>
    //
    // Keyboard:
    //   - None — passive container; clicking the label focuses the associated input via native for attribute
    //
    // Accessibility:
    //   - <label for={fieldId}> links the visible label to the input element
    //   - role="alert" on the error paragraph announces errors to screen readers
    //   - aria-hidden="true" on the required asterisk prevents screen reader noise
    //   - data-required attribute on wrapper for consumer CSS styling
    //
    // Internationalization:
    //   - The label, description, and error props accept any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Auto-generates IDs using $derived() if inputId is not provided
    //   - Derives descId and errorId from the field ID for ARIA linking
    //
    // References:
    //   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
    //   - WAI-ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        description = undefined,
        error = undefined,
        required = false,
        inputId = undefined,
        children,
        ...restProps
    }: {
        /** Visible label text. */
        label: string;
        /** Helper description. */
        description?: string;
        /** Error message. */
        error?: string;
        /** Whether the field is required. */
        required?: boolean;
        /** ID of the input to link the label to. */
        inputId?: string;
        /** Form control. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const uid = $props.id();
    const generatedId = `field-${uid}`;
    let fieldId = $derived(inputId ?? generatedId);
    let descId = $derived(`${fieldId}-desc`);
    let errorId = $derived(`${fieldId}-error`);
</script>

<div
    class={`field ${className}`}
    data-required={required || undefined}
    {...restProps}
>
    <label for={fieldId}
        >{label}{#if required}<span aria-hidden="true"> *</span>{/if}</label
    >
    {#if description}
        <p id={descId}>{description}</p>
    {/if}
    {@render children?.()}
    {#if error}
        <p
            id={errorId}
            role="alert"
        >
            {error}
        </p>
    {/if}
</div>
