<script lang="ts">
    // DateInput component
    //
    // A headless native date input wrapping <input type="date"> with accessible
    // labelling via aria-label and a bindable value. The value is stored in ISO 8601
    // YYYY-MM-DD format. It supports min and max constraints to restrict the allowable
    // date range. Useful in forms where users need to enter a calendar date with the
    // browser's built-in date picker.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name applied via aria-label.
    //   value — string, default "". Bindable date string in YYYY-MM-DD format.
    //   min — string, default undefined. Minimum allowed date in YYYY-MM-DD format.
    //   max — string, default undefined. Maximum allowed date in YYYY-MM-DD format.
    //   required — boolean, default false. Whether the input is required for form submission.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <DateInput label="Birth date" bind:value />
    //
    // Examples:
    //   <!-- Date input with min/max constraints -->
    //   <DateInput label="Deadline" bind:value min="2024-01-01" max="2024-12-31" />
    //   <!-- Required and conditionally disabled -->
    //   <DateInput label="Start date" bind:value required disabled={isLocked} />
    //
    // Keyboard:
    //   - Tab: Move focus to and from the date input (native browser behavior)
    //   - Arrow keys: Navigate within the date picker fields (native browser behavior)
    //   - Enter: Open or confirm the date picker (native browser behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name since there is no visible <label> element
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Renders a bare <input type="date"> with no wrapper element
    //   - Uses $bindable() for two-way binding on the value prop
    //
    // References:
    //   - MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

    let {
        class: className = "",
        label,
        value = $bindable(""),
        min = undefined,
        max = undefined,
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label for the date input. */
        label: string;
        /** Current date value (YYYY-MM-DD). Bindable. */
        value?: string;
        /** Minimum date. */
        min?: string;
        /** Maximum date. */
        max?: string;
        /** Whether the input is required. */
        required?: boolean;
        /** Whether the input is disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DateInput.svelte -->
<input
    class={`date-input ${className}`}
    type="date"
    aria-label={label}
    bind:value
    {min}
    {max}
    {required}
    {disabled}
    {...restProps}
/>
