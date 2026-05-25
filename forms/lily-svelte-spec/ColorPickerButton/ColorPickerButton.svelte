<script lang="ts">
    // ColorPickerButton component
    //
    // A headless button representing a single predefined color choice within a color
    // picker interface. It renders a <button> with inline background-color styling and
    // communicates selected state through aria-pressed. The data-color attribute allows
    // consumers to target specific colors via CSS. Commonly used in color palette UIs,
    // theme builders, and product customization forms.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   color — string, required. CSS color value applied as background-color and exposed via data-color.
    //   label — string, required. Accessible name announced by screen readers (e.g., "Red", "Ocean Blue").
    //   selected — boolean, default false. Whether the swatch is currently selected; reflected in aria-pressed.
    //   disabled — boolean, default false. Whether the swatch is disabled.
    //   onclick — (event: MouseEvent) => void, default undefined. Click handler for selection.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <ColorPickerButton color="#ff0000" label="Red" onclick={handleSelect} />
    //
    // Examples:
    //   <!-- Selected swatch -->
    //   <ColorPickerButton color="#0066cc" label="Blue" selected={true} onclick={handleSelect} />
    //   <!-- Disabled swatch -->
    //   <ColorPickerButton color="#cccccc" label="Gray" disabled={true} />
    //
    // Keyboard:
    //   - Tab: Move focus to the swatch button
    //   - Enter: Activate the button (native button behavior)
    //   - Space: Activate the button (native button behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name since the button has no visible text
    //   - aria-pressed indicates whether the swatch is currently selected in a toggle context
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling (except inline background-color)
    //   - The inline style:background-color is an intrinsic part of the swatch's purpose
    //   - Consumer can use [data-color] CSS selectors for additional styling
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    let {
        class: className = "",
        color,
        label,
        selected = false,
        disabled = false,
        onclick = undefined,
        ...restProps
    }: {
        color: string;
        label: string;
        selected?: boolean;
        disabled?: boolean;
        onclick?: (event: MouseEvent) => void;
        [key: string]: unknown;
    } = $props();
</script>

<button
    class={`color-picker-button ${className}`}
    type="button"
    aria-label={label}
    aria-pressed={selected}
    {disabled}
    style:background-color={color}
    data-color={color}
    {onclick}
    {...restProps}
></button>
