<script lang="ts">
    // Slider component
    //
    // A headless range slider using the native HTML <input type="range"> element.
    // Allows users to select a numeric value by dragging a handle along a track.
    // Commonly used for adjusting settings like volume, brightness, price ranges,
    // or timelines. Provides two-way binding and configurable min/max/step values.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — number, default 50. Current slider value; bindable with bind:value.
    //   min — number, default 0. Minimum allowed value.
    //   max — number, default 100. Maximum allowed value.
    //   step — number, default 1. Increment between allowed values.
    //   disabled — boolean, default false. Whether the slider is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <Slider label="Volume" bind:value min={0} max={100} step={5} />
    //
    // Examples:
    //   <!-- Brightness control -->
    //   <Slider label="Brightness" bind:value={brightness} min={0} max={100} />
    //
    //   <!-- Price range with step -->
    //   <Slider label="Max price" bind:value={maxPrice} min={0} max={1000} step={10} />
    //
    // Keyboard:
    //   - Left Arrow/Down Arrow: decrease value by one step (native behavior)
    //   - Right Arrow/Up Arrow: increase value by one step (native behavior)
    //   - Home: set to minimum value (native behavior)
    //   - End: set to maximum value (native behavior)
    //   - Page Up/Down: increase/decrease by a larger step (browser-dependent)
    //
    // Accessibility:
    //   - aria-label provides the accessible name for the slider
    //   - Native <input type="range"> has implicit slider role
    //   - min, max, step attributes communicate range to assistive technology
    //
    // Internationalization:
    //   - The label prop externalizes the accessible name for localization
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Value uses $bindable() for two-way binding with bind:value
    //   - Relies entirely on native <input type="range"> behavior
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

<!-- Slider.svelte -->
<input
    class={`slider ${className}`}
    type="range"
    aria-label={label}
    bind:value
    {min}
    {max}
    {step}
    {disabled}
    {...restProps}
/>
