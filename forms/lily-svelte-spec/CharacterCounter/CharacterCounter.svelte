<script lang="ts">
    // CharacterCounter component
    //
    // A headless character counter that displays real-time character count
    // information for a text input. Renders a <span> holding the visible count,
    // hidden from assistive technology, and a visually hidden role="status" that
    // takes the same text once typing pauses (announceDelay), so a run of
    // keystrokes is announced once, not once per key, as GOV.UK's character count
    // does. Shows "count / max" when a maximum is provided, or just the count
    // otherwise. Used alongside text inputs with character limits such as tweets,
    // SMS fields, form fields, or bios.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   count — number, default 0. Current character count.
    //   max — number, optional. Maximum allowed characters; enables remaining/over-limit tracking.
    //   label — string, optional. Accessible label for the status via aria-label.
    //   announceDelay — number, default 1000. Milliseconds of quiet before the status takes the new count.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <CharacterCounter count={text.length} max={280} label="Characters" />
    //
    // Examples:
    //   <!-- Counter with maximum limit -->
    //   <CharacterCounter count={text.length} max={280} label="Character count" />
    //
    //   <!-- Counter without maximum (just shows count) -->
    //   <CharacterCounter count={text.length} label="Characters typed" />
    //
    // Keyboard:
    //   None — this component is a passive status display.
    //
    // Accessibility:
    //   - .character-counter-text is the visible count, aria-hidden="true"
    //   - .character-counter-status (also .screen-reader-span, which the themes hide visually) is role="status",
    //     updated announceDelay ms after the count stops changing: one announcement for a run of keystrokes
    //   - aria-label on the status provides context for what the counter represents
    //   - data-count, data-max, data-remaining, data-over-limit for CSS selectors
    //
    // Internationalization:
    //   - Label text comes through the label prop; no hardcoded strings
    //   - Display format is "count / max" — consumer can override via CSS or wrapper
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - data-over-limit attribute is only present when count exceeds max
    //   - Uses $derived() for computed remaining and overLimit values
    //
    // References:
    //   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
    //   - GOV.UK character count: https://design-system.service.gov.uk/components/character-count/

    import { untrack } from "svelte";

    let {
        class: className = "",
        count = 0,
        max = undefined,
        label = undefined,
        announceDelay = 1000,
        ...restProps
    }: {
        /** Current character count */
        count?: number;
        /** Maximum allowed characters (optional) */
        max?: number;
        /** Accessible label for the status */
        label?: string;
        /** Milliseconds of quiet before the status takes the new count */
        announceDelay?: number;
        [key: string]: unknown;
    } = $props();

    let remaining = $derived(max != null ? max - count : undefined);
    let overLimit = $derived(max != null && count > max);

    // Screen reader text: "5 of 280" or "5" or "5 remaining"
    let displayText = $derived(max != null ? `${count} / ${max}` : `${count}`);

    // The status takes the text only once the count has stopped changing for announceDelay ms.
    let announced = $state(untrack(() => displayText));
    $effect(() => {
        const next = displayText;
        const timer = setTimeout(() => (announced = next), announceDelay);
        return () => clearTimeout(timer);
    });
</script>

<!-- CharacterCounter.svelte -->
<span
    class={`character-counter ${className}`}
    data-count={count}
    data-max={max}
    data-remaining={remaining}
    data-over-limit={overLimit || undefined}
    {...restProps}
>
    <span
        class="character-counter-text"
        aria-hidden="true">{displayText}</span
    >
    <span
        class="character-counter-status screen-reader-span"
        role="status"
        aria-label={label}>{announced}</span
    >
</span>
