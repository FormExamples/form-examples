<script lang="ts">
    // CharacterCounter component
    //
    // A headless character counter that displays real-time character count
    // information for a text input. Renders a <span> with role="status" and
    // aria-live="polite" so screen readers announce updates without interrupting
    // the user. Shows "count / max" when a maximum is provided, or just the count
    // otherwise. Used alongside text inputs with character limits such as tweets,
    // SMS fields, form fields, or bios.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   count — number, default 0. Current character count.
    //   max — number, optional. Maximum allowed characters; enables remaining/over-limit tracking.
    //   label — string, optional. Accessible label for the counter via aria-label.
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
    //   - role="status" identifies the element as a live region for advisory information
    //   - aria-live="polite" announces updates at the next convenient pause
    //   - aria-label provides context for what the counter represents
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

    let {
        class: className = "",
        count = 0,
        max = undefined,
        label = undefined,
        ...restProps
    }: {
        /** Current character count */
        count?: number;
        /** Maximum allowed characters (optional) */
        max?: number;
        /** Accessible label for the counter */
        label?: string;
        [key: string]: unknown;
    } = $props();

    let remaining = $derived(max != null ? max - count : undefined);
    let overLimit = $derived(max != null && count > max);

    // Screen reader text: "5 of 280" or "5" or "5 remaining"
    let displayText = $derived(max != null ? `${count} / ${max}` : `${count}`);
</script>

<!-- CharacterCounter.svelte -->
<span
    class={`character-counter ${className}`}
    role="status"
    aria-live="polite"
    aria-label={label}
    data-count={count}
    data-max={max}
    data-remaining={remaining}
    data-over-limit={overLimit || undefined}
    {...restProps}
>
    {displayText}
</span>
