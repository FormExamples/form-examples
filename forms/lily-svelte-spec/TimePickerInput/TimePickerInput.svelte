<script lang="ts">
    // TimePickerInput component
    //
    // A headless time picker that wraps a native <input type="time"> element,
    // allowing users to select a specific time of day. Often used alongside date
    // pickers in forms, scheduling tools, or booking systems. The native input
    // handles 12-hour/24-hour format based on the browser locale. Supports
    // two-way data binding and standard form validation attributes.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Current time value in HH:MM format; bindable with bind:value.
    //   required — boolean, default false. Whether a value is required for form submission.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <TimePickerInput label="Appointment time" bind:value />
    //
    // Examples:
    //   <!-- Required departure time picker -->
    //   <TimePickerInput label="Departure time" bind:value required />
    //
    // Keyboard:
    //   - Tab: move focus to/from the time input
    //   - ArrowUp/ArrowDown: increment/decrement the focused time segment
    //   - ArrowLeft/ArrowRight: move between time segments
    //
    // Accessibility:
    //   - aria-label={label} provides an accessible name for the time input
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - Time format is locale-dependent via native browser behavior
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable() for two-way data binding on value
    //
    // References:
    //   - MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TimePickerInput.svelte -->
<input
    class={`time-picker-input ${className}`}
    type="time"
    aria-label={label}
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
