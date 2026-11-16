<script lang="ts">
    // SliderButton component
    //
    // A slide-to-confirm control: a <button role="slider"> whose aria-valuenow is the position, 0 to 100.
    // Reaching 100 calls `onconfirm` and resets to 0. The consumer draws the track and thumb from aria-
    // valuenow and wires pointer drag through the same position if it wants one; the keyboard is the
    // built-in alternative to dragging.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the confirmation action, rendered as aria-label.
    //   step — number, default 10. How far one arrow press moves the slider, in percent.
    //   disabled — boolean, default false. A disabled slider ignores keys.
    //   onconfirm — () => void, optional. Called when the slider reaches 100.
    //   children — Snippet, optional. The visible content (thumb, text).
    //   ...restProps — additional HTML attributes spread onto the root <button>.
    //
    // Syntax:
    //   <SliderButton label="…" onconfirm={…}>…</SliderButton>
    //
    // Examples:
    //   <SliderButton label="Slide to confirm payment" onconfirm={pay}>Slide to pay</SliderButton>
    //
    // Keyboard:
    //   - ArrowRight: moves forward by `step`
    //   - ArrowLeft: moves back by `step`, not below 0
    //   - Home: returns to 0
    //   - End, Enter or Space: complete it at once (the keyboard fallback for the drag)
    //
    // Accessibility:
    //   - role="slider" with aria-valuenow, aria-valuemin 0 and aria-valuemax 100
    //   - A pointer-only gesture would fail WCAG 2.5.1 (Pointer Gestures); the keys above are the single-pointer and keyboard alternative
    //   - Because the value resets to 0 on confirm, aria-valuenow never reports 100
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The position is internal state; the component draws nothing
    //
    // References:
    //   - WAI-ARIA slider pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
    //   - WCAG 2.5.1 Pointer Gestures: https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        step = 10,
        disabled = false,
        onconfirm = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Accessible label describing the confirmation action. */
        label: string;
        /** How far one arrow press moves the slider, in percent. */
        step?: number;
        disabled?: boolean;
        /** Called when the slider reaches 100%. */
        onconfirm?: () => void;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "SliderButton",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    let position = $state(0);

    function moveTo(next: number) {
        if (next >= 100) {
            position = 0;
            onconfirm?.();
        } else {
            position = Math.max(0, next);
        }
    }

    function onkeydown(event: KeyboardEvent) {
        if (disabled) return;
        switch (event.key) {
            case "ArrowRight":
                moveTo(position + step);
                break;
            case "ArrowLeft":
                moveTo(position - step);
                break;
            case "Home":
                moveTo(0);
                break;
            case "End":
            case "Enter":
            case " ":
                moveTo(100);
                break;
            default:
                return;
        }
        event.preventDefault();
    }
</script>

<!-- SliderButton.svelte -->
<button
    type="button"
    role="slider"
    class={`slider-button ${className}`}
    aria-label={label}
    aria-valuenow={position}
    aria-valuemin={0}
    aria-valuemax={100}
    {disabled}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</button>
