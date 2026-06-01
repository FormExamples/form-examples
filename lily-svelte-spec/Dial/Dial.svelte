<script lang="ts">
    // Dial component
    //
    // A circular dial or knob control for adjusting a numeric value within a
    // defined range. Renders as a div with role="slider" and full keyboard
    // navigation. Common use cases include volume controls, thermostats, and
    // audio equipment settings in control panels and configuration interfaces.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — number, default 0. Current dial value; bindable.
    //   min — number, default 0. Minimum allowed value.
    //   max — number, default 100. Maximum allowed value.
    //   step — number, default 1. Increment per key press.
    //   label — string, required. Accessible name for the dial.
    //   disabled — boolean, default false. Whether the dial is disabled.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Dial label="Volume" bind:value min={0} max={100} />
    //
    // Examples:
    //   <!-- Brightness dial with step of 5 -->
    //   <Dial label="Brightness" bind:value={brightness} min={0} max={100} step={5} />
    //
    //   <!-- Disabled dial -->
    //   <Dial label="Disabled control" value={30} disabled />
    //
    // Keyboard:
    //   - ArrowRight/ArrowUp: increase value by one step
    //   - ArrowLeft/ArrowDown: decrease value by one step
    //   - Shift+Arrow: increase/decrease value by 10 steps
    //   - Home: set value to minimum
    //   - End: set value to maximum
    //
    // Accessibility:
    //   - role="slider" indicates a range input control
    //   - aria-label provides the accessible name
    //   - aria-valuenow, aria-valuemin, aria-valuemax communicate current range state
    //   - aria-disabled="true" present only when disabled
    //   - tabindex="0" when enabled, tabindex="-1" when disabled
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Internal clamp() ensures value stays within min/max bounds
    //   - No native dial element exists; uses div with role="slider"
    //
    // References:
    //   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
    //   - WAI-ARIA slider role: https://www.w3.org/TR/wai-aria-1.2/#slider

    let {
        class: className = "",
        value = $bindable(0),
        min = 0,
        max = 100,
        step = 1,
        label,
        disabled = false,
        ...restProps
    }: {
        /** Current value. Bindable. */
        value?: number;
        /** Minimum value. */
        min?: number;
        /** Maximum value. */
        max?: number;
        /** Step increment per key press. */
        step?: number;
        /** Accessible label for the dial. */
        label: string;
        /** Whether the dial is disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    function clamp(v: number): number {
        return Math.min(max, Math.max(min, v));
    }

    function onkeydown(event: KeyboardEvent) {
        if (disabled) return;
        const multiplier = event.shiftKey ? 10 : 1;
        switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
                value = clamp(value + step * multiplier);
                event.preventDefault();
                break;
            case "ArrowLeft":
            case "ArrowDown":
                value = clamp(value - step * multiplier);
                event.preventDefault();
                break;
            case "Home":
                value = min;
                event.preventDefault();
                break;
            case "End":
                value = max;
                event.preventDefault();
                break;
        }
    }
</script>

<!-- Dial.svelte -->
<div
    class={`dial ${className}`}
    role="slider"
    tabindex={disabled ? -1 : 0}
    aria-label={label}
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-disabled={disabled || undefined}
    {onkeydown}
    {...restProps}
></div>
