<script lang="ts">
    // DateTimeLocalInput component
    //
    // A headless native datetime-local input wrapping <input type="datetime-local">
    // with accessible labelling via aria-label and a bindable value. The value follows
    // the format YYYY-MM-DDThh:mm, and the browser provides the native date-time picker
    // UI. Useful for scheduling interfaces, event creation forms, appointment booking,
    // and any scenario where both date and time must be captured in a single field.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name applied via aria-label.
    //   value — string, default "". Bindable datetime string (format: YYYY-MM-DDThh:mm).
    //   min — string, default undefined. Minimum allowed datetime.
    //   max — string, default undefined. Maximum allowed datetime.
    //   required — boolean, default false. Whether the input is required for form submission.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <DateTimeLocalInput label="Event start" bind:value />
    //
    // Examples:
    //   <!-- DateTime input with min/max constraints -->
    //   <DateTimeLocalInput label="Appointment" bind:value min="2024-01-01T08:00" max="2024-12-31T18:00" />
    //   <!-- Required and conditionally disabled -->
    //   <DateTimeLocalInput label="Departure time" bind:value required disabled={isLocked} />
    //
    // Keyboard:
    //   - Tab: Move focus to and from the datetime input (native browser behavior)
    //   - Arrow keys: Navigate within the datetime picker fields (native browser behavior)
    //   - Enter: Open or confirm the datetime picker (native browser behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name since there is no visible <label> element
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Renders a bare <input type="datetime-local"> with no wrapper element
    //   - Uses $bindable() for two-way binding on the value prop
    //
    // References:
    //   - MDN datetime-local input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local

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
        /** Accessible label for the input. */
        label: string;
        /** Current datetime value. Bindable. */
        value?: string;
        /** Minimum datetime. */
        min?: string;
        /** Maximum datetime. */
        max?: string;
        /** Whether the input is required. */
        required?: boolean;
        /** Whether the input is disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DateTimeLocalInput.svelte -->
<input
    class={`date-time-local-input ${className}`}
    type="datetime-local"
    aria-label={label}
    bind:value
    {min}
    {max}
    {required}
    {disabled}
    {...restProps}
/>
