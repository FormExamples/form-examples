<script lang="ts">
    // RedAmberGreenRadioInput component
    //
    // A headless bare <input type="radio"> element for one choice of a red/amber/green status, carrying data-value for consumer CSS, without a wrapping label, designed
    // for custom radio group layouts where labels are provided separately or by a
    // parent component. It uses aria-label for accessible naming. Useful in custom
    // card selection interfaces, segmented controls, and layouts where the radio
    // button and its label need independent positioning or styling.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   name — string, optional. Radio group name for mutual exclusion.
    //   value — string, optional. The value representing this radio option.
    //   checked — boolean, default false. Whether this radio button is selected.
    //   disabled — boolean, default false. Whether the radio button is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <RedAmberGreenRadioInput label="Option A" name="choice" value="a" />
    //
    // Examples:
    //   <!-- Single radio input -->
    //   <RedAmberGreenRadioInput label="Option A" name="choice" value="a" />
    //
    //   <!-- Radio group with pre-selected option -->
    //   <RedAmberGreenRadioInput label="Small" name="size" value="small" checked />
    //   <RedAmberGreenRadioInput label="Medium" name="size" value="medium" />
    //   <RedAmberGreenRadioInput label="Large" name="size" value="large" />
    //
    // Keyboard:
    //   - Tab: moves focus to the selected radio in the group (or first if none selected)
    //   - Arrow Up / Arrow Left: moves selection to the previous radio in the group
    //   - Arrow Down / Arrow Right: moves selection to the next radio in the group
    //   - Space: selects the focused radio button if not already selected
    //
    // Accessibility:
    //   - aria-label provides an accessible name since no visible <label> is included
    //   - Native radio input provides built-in role="radio" semantics
    //
    // Internationalization:
    //   - The label prop is the only user-facing text; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Do not wrap in a <div> or <label> — renders a bare <input> element
    //   - Does not use $bindable() for checked; consumers use event handlers or bind directly
    //
    // References:
    //   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
    //   - MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio

    let {
        class: className = "",
        label,
        name = undefined,
        value = undefined,
        checked = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Radio group name. */
        name?: string;
        /** Value for this option. */
        value?: string;
        /** Whether checked. */
        checked?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- RedAmberGreenRadioInput.svelte -->
<input
    class={`red-amber-green-radio-input ${className}`}
    type="radio"
    aria-label={label}
    {name}
    {value}
    data-value={value}
    {checked}
    {disabled}
    {...restProps}
/>
