<script lang="ts">
    // DateTimeNowInput component
    //
    // A headless component that wraps a native <input type="date">, <input type="time">,
    // and <button type="button"> inside a <div>. The "Now" button sets both inputs to the
    // current local date and time when clicked. Useful for event logging, timestamping,
    // incident reporting, and any scenario where users need to quickly capture the current
    // date and time or manually enter a specific date and time.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the wrapper group via aria-label.
    //   dateLabel — string, default "Date". Accessible name for the date input via aria-label.
    //   timeLabel — string, default "Time". Accessible name for the time input via aria-label.
    //   nowLabel — string, default "Now". Accessible label and text for the "Now" button.
    //   dateValue — string, default "". Bindable date string (format: YYYY-MM-DD).
    //   timeValue — string, default "". Bindable time string (format: HH:mm).
    //   required — boolean, default false. Whether the inputs are required.
    //   disabled — boolean, default false. Whether the inputs and button are disabled.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <DateTimeNowInput label="Event time" bind:dateValue bind:timeValue />
    //
    // Examples:
    //   <!-- Basic usage -->
    //   <DateTimeNowInput label="Event time" bind:dateValue bind:timeValue />
    //
    //   <!-- Custom labels for internationalization -->
    //   <DateTimeNowInput label="Heure" dateLabel="Date" timeLabel="Heure" nowLabel="Maintenant" bind:dateValue bind:timeValue />
    //
    //   <!-- Required and disabled -->
    //   <DateTimeNowInput label="Appointment" bind:dateValue bind:timeValue required disabled={isLocked} />
    //
    // Keyboard:
    //   - Tab: Moves focus between the date input, time input, and "Now" button
    //   - Enter/Space on the "Now" button: Sets both inputs to the current date and time
    //   - Arrow keys: Navigate within the date and time picker fields (native browser behavior)
    //
    // Accessibility:
    //   - role="group" on the wrapper with aria-label for grouping
    //   - aria-label on the date input provides the accessible name
    //   - aria-label on the time input provides the accessible name
    //   - aria-label on the "Now" button describes its purpose
    //
    // Internationalization:
    //   - The label, dateLabel, timeLabel, and nowLabel props are the only user-facing strings
    //   - Default labels are "Date", "Time", and "Now"; override for other locales
    //   - No other hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - restProps spread onto the wrapper <div>, not the inputs
    //
    // References:
    //   - MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
    //   - MDN time input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

    let {
        class: className = "",
        label,
        dateLabel = "Date",
        timeLabel = "Time",
        nowLabel = "Now",
        dateValue = $bindable(""),
        timeValue = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        dateLabel?: string;
        timeLabel?: string;
        nowLabel?: string;
        dateValue?: string;
        timeValue?: string;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    function handleNow() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        dateValue = `${year}-${month}-${day}`;
        timeValue = `${hours}:${minutes}`;
    }
</script>

<!-- DateTimeNowInput.svelte -->
<div
    class={`date-time-now-input ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    <input
        type="date"
        aria-label={dateLabel}
        bind:value={dateValue}
        {required}
        {disabled}
    />
    <input
        type="time"
        aria-label={timeLabel}
        bind:value={timeValue}
        {required}
        {disabled}
    />
    <button
        type="button"
        aria-label={nowLabel}
        onclick={handleNow}
        {disabled}
    >
        {nowLabel}
    </button>
</div>
