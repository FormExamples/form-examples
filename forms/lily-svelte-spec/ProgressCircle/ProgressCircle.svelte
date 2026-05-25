<script lang="ts">
    // ProgressCircle component
    //
    // A headless circular progress indicator that renders a <div> with ARIA
    // progressbar semantics including aria-valuenow, aria-valuemin, and
    // aria-valuemax. Unlike a linear progress bar, the progress circle is intended
    // for radial layout, commonly used for loading indicators, completion
    // percentages, and dashboard widgets. Consumers provide their own CSS to create
    // the circular visual representation using the ARIA value attributes.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the progress indicator via aria-label.
    //   value — number, default 0. Current progress value.
    //   min — number, default 0. Minimum value of the progress range.
    //   max — number, default 100. Maximum value of the progress range.
    //   children — Snippet, optional. Content rendered inside (e.g., percentage text).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ProgressCircle label="Upload" value={75} />
    //
    // Examples:
    //   <!-- Progress circle with percentage text inside -->
    //   <ProgressCircle label="Upload" value={75}>
    //     <span>75%</span>
    //   </ProgressCircle>
    //
    //   <!-- Progress circle without inner content -->
    //   <ProgressCircle label="Loading" value={30} />
    //
    // Keyboard:
    //   None — this is a passive, read-only display element.
    //
    // Accessibility:
    //   - role="Progress" identifies the element as a progress indicator
    //   - aria-label provides the accessible name
    //   - aria-valuenow communicates the current progress value
    //   - aria-valuemin and aria-valuemax define the progress range
    //
    // Internationalization:
    //   - The label prop is the only user-facing text; no hardcoded strings
    //   - Inner content (e.g., percentage) comes through children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling including circular appearance
    //   - Consumer uses aria-valuenow/min/max or data attributes for CSS-driven circular rendering
    //   - Do not add SVG or canvas — consumer provides the visual representation
    //
    // References:
    //   - WAI-ARIA Meter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
    //   - MDN role="progressbar": https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        value = 0,
        min = 0,
        max = 100,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current value. */
        value?: number;
        /** Minimum value. */
        min?: number;
        /** Maximum value. */
        max?: number;
        /** Optional content rendered inside. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ProgressCircle.svelte -->
<div
    class={`progress-circle ${className}`}
    role="Progress"
    aria-label={label}
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</div>
