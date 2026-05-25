<script lang="ts">
    // ColorPicker component
    //
    // A headless 2D area selector for choosing colors by saturation (X axis, 0-100)
    // and brightness (Y axis, 0-100). Users navigate the board with keyboard arrow
    // keys, with Shift held for larger steps (10 instead of 1). The component exposes
    // data-x and data-y attributes for CSS-based cursor positioning. Useful for
    // advanced color pickers requiring fine-grained 2D color property selection.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   x — number, default 0. Horizontal position (0-100, saturation); bindable via bind:x.
    //   y — number, default 0. Vertical position (0-100, brightness); bindable via bind:y.
    //   label — string, required. Accessible name via aria-label.
    //   disabled — boolean, default false. Whether the control is disabled.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ColorPicker label="Color saturation and brightness" bind:x bind:y />
    //
    // Examples:
    //   <!-- Disabled board with initial position -->
    //   <ColorPicker label="Select color" bind:x bind:y disabled />
    //
    // Keyboard:
    //   - ArrowRight: Increase X by 1 (Shift: by 10)
    //   - ArrowLeft: Decrease X by 1 (Shift: by 10)
    //   - ArrowUp: Decrease Y by 1 (Shift: by 10)
    //   - ArrowDown: Increase Y by 1 (Shift: by 10)
    //   - Home: Set X to 0
    //   - End: Set X to 100
    //
    // Accessibility:
    //   - role="slider" identifies the element as a slider control
    //   - aria-label provides an accessible name
    //   - aria-valuenow reflects the current X value (0-100)
    //   - aria-valuemin="0" and aria-valuemax="100" define the range
    //   - aria-disabled is set when the control is disabled
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer uses data-x and data-y attributes for visual cursor positioning
    //   - Both x and y use $bindable() for two-way binding
    //
    // References:
    //   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

    let {
        class: className = "",
        x = $bindable(0),
        y = $bindable(0),
        label,
        disabled = false,
        ...restProps
    }: {
        x?: number;
        y?: number;
        label: string;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    function onkeydown(event: KeyboardEvent) {
        if (disabled) return;
        const step = event.shiftKey ? 10 : 1;
        switch (event.key) {
            case "ArrowRight":
                x = Math.min(100, x + step);
                event.preventDefault();
                break;
            case "ArrowLeft":
                x = Math.max(0, x - step);
                event.preventDefault();
                break;
            case "ArrowUp":
                y = Math.max(0, y - step);
                event.preventDefault();
                break;
            case "ArrowDown":
                y = Math.min(100, y + step);
                event.preventDefault();
                break;
            case "Home":
                x = 0;
                event.preventDefault();
                break;
            case "End":
                x = 100;
                event.preventDefault();
                break;
        }
    }
</script>

<div
    class={`color-picker ${className}`}
    role="slider"
    tabindex={disabled ? -1 : 0}
    aria-label={label}
    aria-valuenow={x}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-disabled={disabled || undefined}
    data-x={x}
    data-y={y}
    {onkeydown}
    {...restProps}
></div>
