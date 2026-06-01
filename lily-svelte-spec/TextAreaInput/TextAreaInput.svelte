<script lang="ts">
    // TextAreaInput component
    //
    // A headless multi-line text input that wraps the native HTML <textarea>
    // element. Used for comments, messages, descriptions, feedback, code input,
    // and any scenario where users need to enter extended text content. Unlike
    // a single-line TextInput, TextAreaInput provides a larger, scrollable text area
    // that supports multiple lines.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Bindable text content; supports bind:value.
    //   rows — number, default undefined. Number of visible text rows.
    //   required — boolean, default false. Whether the text-area-input is required.
    //   disabled — boolean, default false. Whether the text-area-input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <textarea>.
    //
    // Syntax:
    //   <TextAreaInput label="Comments" bind:value rows={5} />
    //
    // Examples:
    //   <!-- Required description field -->
    //   <TextAreaInput label="Description" bind:value={description} required />
    //
    //   <!-- Read-only notes -->
    //   <TextAreaInput label="Notes" bind:value disabled={isReadOnly} />
    //
    // Keyboard:
    //   - Tab: moves focus to and from the text-area-input (native behavior)
    //   - Enter: inserts a new line (does not submit forms)
    //   - All standard text editing keys function normally
    //
    // Accessibility:
    //   - aria-label={label} provides an accessible name since no visible <label> is included
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable() for two-way data binding on value
    //   - Consumer can wrap with their own visible <label> element
    //
    // References:
    //   - MDN text-area-input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/text-area-input

    let {
        class: className = "",
        label,
        value = $bindable(""),
        rows = undefined,
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current value. Bindable. */
        value?: string;
        /** Number of visible rows. */
        rows?: number;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TextAreaInput.svelte -->
<textarea
    class={`text-area-input ${className}`}
    aria-label={label}
    bind:value
    {rows}
    {required}
    {disabled}
    {...restProps}
></textarea>
