<script lang="ts">
    // TimerButton component
    //
    // A button that counts down `duration` seconds and then activates itself; a click (or Enter or Space,
    // natively) activates it at once. It activates once only. The countdown is exposed as data-remaining-
    // seconds for the consumer's display, and aria-live="polite" announces the consumer's text as it
    // changes.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the action, rendered as aria-label.
    //   duration — number, required. Countdown length in seconds.
    //   disabled — boolean, default false. A disabled button neither counts down nor fires.
    //   onclick — () => void, optional. Called once, when the countdown ends or the button is pressed.
    //   children — Snippet, optional. The visible content, for example the remaining seconds.
    //   ...restProps — additional HTML attributes spread onto the root <button>.
    //
    // Syntax:
    //   <TimerButton label="…" duration={10} onclick={…}>…</TimerButton>
    //
    // Examples:
    //   <TimerButton label="Continue now" duration={10} onclick={next}>Continuing in 10 seconds</TimerButton>
    //
    // Keyboard:
    //   - Enter / Space: activates at once (native <button>)
    //   - Tab: moves focus onto the button
    //
    // Accessibility:
    //   - aria-label comes from `label`; keep it containing the visible text (WCAG 2.5.3)
    //   - aria-live="polite" announces changes to the children; avoid updating them every second, which floods a screen reader
    //   - An automatic action should be cancellable or extendable (WCAG 2.2.1 Timing Adjustable)
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Counts with a 250 ms interval against Date.now(), so a throttled background tab catches up
    //   - Fires once; data-remaining-seconds is the only visual output
    //
    // References:
    //   - WCAG 2.2.1 Timing Adjustable: https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
    //   - MDN <button>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button

    import { warnMissingName } from "../dev-warning";
    import { onMount, type Snippet } from "svelte";
    let {
        class: className = "",
        label,
        duration,
        disabled = false,
        onclick = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Accessible label describing the action. */
        label: string;
        /** Countdown duration in seconds. */
        duration: number;
        disabled?: boolean;
        /** Called once, when the countdown ends or the button is pressed. */
        onclick?: () => void;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "TimerButton",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    let remaining = $state(0);
    let fired = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    function fire() {
        if (fired) return;
        fired = true;
        clearInterval(timer);
        onclick?.();
    }

    onMount(() => {
        remaining = duration;
        if (disabled) return;
        const start = Date.now();
        timer = setInterval(() => {
            remaining = Math.max(0, duration - Math.floor((Date.now() - start) / 1000));
            if (remaining === 0) fire();
        }, 250);
        return () => clearInterval(timer);
    });

    function handleClick() {
        if (disabled) return;
        fire();
    }
</script>

<!-- TimerButton.svelte -->
<button
    type="button"
    class={`timer-button ${className}`}
    aria-label={label}
    aria-live="polite"
    data-remaining-seconds={remaining}
    {disabled}
    onclick={handleClick}
    {...restProps}
>
    {@render children?.()}
</button>
