<script lang="ts">
    // RedOrangeYellowGreenBluePickerButton component
    //
    // A headless button representing one Red/Orange/Yellow/Green/Blue status choice
    // within a ROYGB status picker. Renders a <button> with aria-pressed to indicate
    // the selected state and data-value for consumer CSS targeting. Used in multi-tier
    // alert systems, dashboards, and risk registers with five severity levels.
    //
    // Props:
    //   value — string, required. The status value (e.g. "red", "orange", "yellow", "green", "blue").
    //   label — string, required. Accessible name for the button via aria-label.
    //   selected — boolean, default false. Whether this status is currently selected.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   onclick — (event: MouseEvent) => void, optional. Click handler.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <RedOrangeYellowGreenBluePickerButton value="green" label="Green" onclick={handleSelect} />
    //
    // Examples:
    //   <!-- Selected status button -->
    //   <RedOrangeYellowGreenBluePickerButton value="red" label="Red" selected={true} onclick={handleSelect} />
    //   <!-- Disabled status button -->
    //   <RedOrangeYellowGreenBluePickerButton value="yellow" label="Yellow" disabled={true} />
    //
    // Keyboard:
    //   - Tab: Move focus to the button
    //   - Enter: Activate the button (native button behavior)
    //   - Space: Activate the button (native button behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name for the button
    //   - aria-pressed indicates whether the status is currently selected
    //   - data-value exposes the status value for consumer CSS selectors
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: used as a child within RedOrangeYellowGreenBluePicker
    //   - Consumer can use [data-value] CSS selectors for status-based styling
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
    //   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

    let {
        class: className = "",
        value,
        label,
        selected = false,
        disabled = false,
        onclick = undefined,
        ...restProps
    }: {
        /** The status value (e.g. "red", "orange", "yellow", "green", "blue"). */
        value: string;
        /** Accessible name for the button. */
        label: string;
        /** Whether this status is currently selected. */
        selected?: boolean;
        /** Whether the button is disabled. */
        disabled?: boolean;
        /** Click handler. */
        onclick?: (event: MouseEvent) => void;
        [key: string]: unknown;
    } = $props();
</script>

<!-- RedOrangeYellowGreenBluePickerButton.svelte -->
<button
    class={`red-orange-yellow-green-blue-picker-button ${className}`}
    type="button"
    aria-label={label}
    aria-pressed={selected}
    {disabled}
    data-value={value}
    {onclick}
    {...restProps}
>{label}</button>
