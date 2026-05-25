<script lang="ts">
    // RangeInput component
    //
    // A headless slider control using the native <input type="range"> element for
    // selecting a numeric value within a defined range. It renders a draggable track
    // and handle with configurable minimum, maximum, and step values, and provides a
    // bindable value prop for two-way data binding. Commonly used for volume controls,
    // brightness settings, price filters, and continuous numeric spectrum selections.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — number, default 50. Current numeric value; bindable with bind:value.
    //   min — number, default 0. Minimum allowed value.
    //   max — number, default 100. Maximum allowed value.
    //   step — number, default 1. Increment between selectable values.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <RangeInput label="Volume" bind:value />
    //
    // Examples:
    //   <!-- Volume slider -->
    //   <RangeInput label="Volume" bind:value min={0} max={100} />
    //
    //   <!-- Price range with step -->
    //   <RangeInput label="Price range" bind:value={price} min={10} max={500} step={10} />
    //
    // Keyboard:
    //   - Left Arrow / Down Arrow: decrease value by one step
    //   - Right Arrow / Up Arrow: increase value by one step
    //   - Home: set to minimum value
    //   - End: set to maximum value
    //   - Page Down: decrease by a larger step (browser-defined)
    //   - Page Up: increase by a larger step (browser-defined)
    //
    // Accessibility:
    //   - aria-label provides the accessible name since no visible <label> is associated
    //   - Native <input type="range"> provides implicit slider role and value announcements
    //
    // Internationalization:
    //   - The label prop is the only user-facing text; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Default value is 50, centered in the default 0-100 range
    //   - Do not wrap in a <div> — renders a bare <input> element
    //   - Keyboard interactions are provided natively by <input type="range">
    //
    // References:
    //   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
    //   - MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range

    let {
        class: className = "",
        label,
        value = $bindable(50),
        min = 0,
        max = 100,
        step = 1,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current value. Bindable. */
        value?: number;
        /** Minimum value. */
        min?: number;
        /** Maximum value. */
        max?: number;
        /** Step increment. */
        step?: number;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- RangeInput.svelte -->
<input
    class={`range-input ${className}`}
    type="range"
    aria-label={label}
    bind:value
    {min}
    {max}
    {step}
    {disabled}
    {...restProps}
/>
