<script lang="ts">
    // DateTimeView component
    //
    // A headless read-only display of a formatted date and time. Renders a native
    // `<time>` element with the machine-readable `datetime` attribute set to the
    // ISO 8601 value. Display text falls back: children → format → value.
    // The component does not localize — consumers pass a pre-formatted display string.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   value — string, required. ISO 8601 datetime value for the `datetime` attribute.
    //   format — string, optional. Pre-formatted display text.
    //   label — string, optional. aria-label override.
    //   children — Snippet, optional. Custom display content (overrides `format`).
    //   ...restProps — additional HTML attributes spread onto the <time>.
    //
    // Syntax:
    //   <DateTimeView value="2026-01-31T10:00:00Z" format="Jan 31, 2026, 10:00 AM" />
    //
    // Examples:
    //   <DateTimeView value={iso} format={displayText} label="Published" />
    //
    // Keyboard:
    //   - None (read-only display)
    //
    // Accessibility:
    //   - Implicit `<time>` semantics
    //   - aria-label optional override
    //
    // Internationalization:
    //   - Consumer formats the display text; component renders raw value as fallback
    //
    // Claude rules:
    //   - Headless: no styles
    //   - Date formatting is the consumer's responsibility (Intl.DateTimeFormat etc.)
    //
    // References:
    //   - MDN <time>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        value,
        format = undefined,
        label = undefined,
        children = undefined,
        ...restProps
    }: {
        /** ISO 8601 datetime string */
        value: string;
        /** Pre-formatted display text */
        format?: string;
        /** aria-label override */
        label?: string;
        /** Custom display content (overrides format) */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DateTimeView.svelte -->
<time
    class={`date-time-view ${className}`}
    datetime={value}
    aria-label={label}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {:else if format}
        {format}
    {:else}
        {value}
    {/if}
</time>
