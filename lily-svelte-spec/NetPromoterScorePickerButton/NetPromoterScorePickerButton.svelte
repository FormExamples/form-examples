<script lang="ts">
    // NetPromoterScorePickerButton component
    //
    // A headless button representing one score in a Net Promoter Score picker.
    // Renders a <button> with aria-pressed to indicate the selected state and
    // data-value for consumer CSS targeting. Each button represents a score (0-10)
    // in the NPS scale. Commonly used in customer loyalty surveys and feedback forms.
    //
    // Props:
    //   value — number, required. The NPS score value (0-10).
    //   label — string, required. Accessible name for the button.
    //   selected — boolean, default false. Whether this score is currently selected.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   onclick — (event: MouseEvent) => void, optional. Click handler.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <NetPromoterScorePickerButton value={9} label="9" onclick={handleSelect} />
    //
    // Examples:
    //   <!-- Selected NPS button -->
    //   <NetPromoterScorePickerButton value={10} label="10" selected={true} onclick={handleSelect} />
    //   <!-- Disabled NPS button -->
    //   <NetPromoterScorePickerButton value={0} label="0" disabled={true} />
    //
    // Keyboard:
    //   - Tab: Move focus to the button
    //   - Enter: Activate the button (native button behavior)
    //   - Space: Activate the button (native button behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name for the button
    //   - aria-pressed indicates whether the score is currently selected
    //   - data-value exposes the score for consumer CSS selectors
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: used as a child within NetPromoterScorePicker
    //   - Consumer can use [data-value] CSS selectors for score-based styling
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
    //   - Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score

    let {
        class: className = "",
        value,
        label,
        selected = false,
        disabled = false,
        onclick = undefined,
        ...restProps
    }: {
        /** The NPS score value (0-10). */
        value: number;
        /** Accessible name for the button. */
        label: string;
        /** Whether this score is currently selected. */
        selected?: boolean;
        /** Whether the button is disabled. */
        disabled?: boolean;
        /** Click handler. */
        onclick?: (event: MouseEvent) => void;
        [key: string]: unknown;
    } = $props();
</script>

<!-- NetPromoterScorePickerButton.svelte -->
<button
    class={`net-promoter-score-picker-button ${className}`}
    type="button"
    aria-label={label}
    aria-pressed={selected}
    {disabled}
    data-value={value}
    {onclick}
    {...restProps}
>{label}</button>
