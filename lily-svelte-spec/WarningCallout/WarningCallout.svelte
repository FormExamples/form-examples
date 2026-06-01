<script lang="ts">
    // WarningCallout component
    //
    // A headless warning container that renders an <aside> element with
    // role="alert" for immediate screen reader announcements. Used to draw
    // attention to important alerts, potential issues, or critical information
    // that requires user attention. The role="alert" implicitly sets
    // aria-live="assertive", meaning content is announced immediately when
    // it appears or changes.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, default undefined. Optional accessible name via aria-label.
    //   children — Snippet, required. The warning content to display.
    //   ...restProps — additional HTML attributes spread onto the <aside>.
    //
    // Syntax:
    //   <WarningCallout label="Warning">...</WarningCallout>
    //
    // Examples:
    //   <!-- Warning with accessible label -->
    //   <WarningCallout label="Warning">
    //     <p>Your session is about to expire.</p>
    //   </WarningCallout>
    //
    //   <!-- Warning without label (alert content is self-descriptive) -->
    //   <WarningCallout>
    //     <p>Unsaved changes will be lost.</p>
    //   </WarningCallout>
    //
    // Keyboard:
    //   - None -- passive container for alert content
    //
    // Accessibility:
    //   - role="alert" causes screen readers to announce content immediately
    //   - aria-label provides an optional accessible name to distinguish multiple alerts
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All warning content is provided through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - label is optional since alert content itself provides the message
    //
    // References:
    //   - WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
    //   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        /** Optional accessible label. */
        label?: string;
        /** Warning content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- WarningCallout.svelte -->
<aside
    class={`warning-callout ${className}`}
    role="alert"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</aside>
