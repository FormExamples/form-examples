<script lang="ts">
    // Statistic component
    //
    // A numeric value display with title, prefix, and suffix. The consumer is
    // responsible for formatting the value as a string (number formatting,
    // localization). The component renders a role="group" container with a
    // title and a value, optionally wrapped by a prefix snippet and a suffix
    // snippet.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   title — string, REQUIRED. Statistic label/heading.
    //   value — string, REQUIRED. Pre-formatted value text.
    //   label — string, optional. aria-label override (defaults to "{title}: {value}").
    //   prefix — Snippet, optional. Element before the value (e.g., currency symbol).
    //   suffix — Snippet, optional. Element after the value (e.g., unit or %).
    //   change — string, optional. The change in words that name its comparison ("0.5 more than October 2024").
    //   trend — "up" | "down" | "flat", optional. data-trend on the change, for the theme; no arrow is rendered.
    //   asOf — string, optional. ISO 8601 date or date-time for the as-of <time>.
    //   asOfLabel — string, optional. When the value was measured, in words; the as-of line renders only with it.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Statistic title="Active users" value="1,234" />
    //
    // Examples:
    //   <Statistic title="Revenue" value="42">
    //     {#snippet prefix()}$ {/snippet}
    //     {#snippet suffix()} M{/snippet}
    //   </Statistic>
    //
    // Accessibility:
    //   - role="group" with aria-label so screen readers announce the pair.
    //   - A change is said in words; its direction is never an arrow or a colour alone (an arrow is the theme's).
    //
    // Internationalization:
    //   - title, value, label all come through props; consumer formats numbers.
    //
    // Claude rules:
    //   - Headless: no styles.
    //   - title and value are REQUIRED.
    //
    // References:
    //   - Ant Design Statistic: https://ant.design/components/statistic

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        title,
        value,
        label = undefined,
        prefix = undefined,
        suffix = undefined,
        change = undefined,
        trend = undefined,
        asOf = undefined,
        asOfLabel = undefined,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Statistic title (REQUIRED) */
        title: string;
        /** Pre-formatted value text (REQUIRED) */
        value: string;
        /** aria-label override */
        label?: string;
        /** Element before the value */
        prefix?: Snippet;
        /** Element after the value */
        suffix?: Snippet;
        /** The change, in words that name what it is compared with ("0.5 more than October 2024") */
        change?: string;
        /** The direction of the change, as data-trend for the theme; the words in `change` carry it for everyone */
        trend?: "up" | "down" | "flat";
        /** When the value was measured, as an ISO 8601 date or date-time for the <time> element */
        asOf?: string;
        /** When the value was measured, in words ("Data as of 1 December 2024"); the as-of line renders only with it */
        asOfLabel?: string;
        [key: string]: unknown;
    } = $props();

    const ariaLabel = $derived(label ?? `${title}: ${value}`);
</script>

<!-- Statistic.svelte -->
<div
    class={`statistic ${className}`}
    role="group"
    aria-label={ariaLabel}
    {...restProps}
>
    <div class="statistic-title">{title}</div>
    <div class="statistic-value">
        {#if prefix}<span class="statistic-prefix">{@render prefix()}</span>{/if}
        {value}
        {#if suffix}<span class="statistic-suffix">{@render suffix()}</span>{/if}
    </div>
    {#if change}
        <div
            class="statistic-change"
            data-trend={trend}
        >
            {change}
        </div>
    {/if}
    {#if asOfLabel}
        <time
            class="statistic-as-of"
            datetime={asOf}>{asOfLabel}</time
        >
    {/if}
</div>
