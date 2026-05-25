<script lang="ts">
    // MonthInput component
    //
    // A headless month input that wraps a native <input type="month"> element with
    // accessible labelling for selecting a month and year. It provides a bindable
    // value in YYYY-MM format and supports required and disabled states. Useful for
    // credit card expiration dates, report periods, billing cycles, or any date
    // selection at month granularity.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the input via aria-label.
    //   value — string, default "". Current month value in YYYY-MM format; bindable via $bindable().
    //   required — boolean, default false. Whether the input is required.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <MonthInput label="Start month" bind:value />
    //
    // Examples:
    //   <!-- Basic month picker -->
    //   <MonthInput label="Start month" bind:value />
    //
    //   <!-- Required month input with min/max constraints -->
    //   <MonthInput label="Expiration" bind:value required min="2024-01" max="2030-12" />
    //
    // Keyboard:
    //   - Native browser month input keyboard behavior (varies by browser).
    //
    // Accessibility:
    //   - aria-label={label} provides an accessible name describing the input purpose
    //   - Supports required and disabled HTML states
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Value format is always YYYY-MM per the HTML spec
    //
    // References:
    //   - HTML month input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month

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

<!-- MonthInput.svelte -->
<input
    class={`month-input ${className}`}
    type="month"
    aria-label={label}
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
