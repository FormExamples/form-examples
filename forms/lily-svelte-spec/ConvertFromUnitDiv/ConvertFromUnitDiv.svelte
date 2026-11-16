<script lang="ts">
    // ConvertFromUnitDiv component
    //
    // The unit to convert from, such as a select box of currencies or lengths. Converts nothing; the
    // consumer does the arithmetic and supplies the controls and any rates.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, optional. The unit control.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <ConvertFromUnitDiv>…</ConvertFromUnitDiv>
    //
    // Examples:
    //   <ConvertDiv label="Convert currency"><ConvertFromDiv>…</ConvertFromDiv><ConvertIntoDiv>…</ConvertIntoDiv></ConvertDiv>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - No role or ARIA of its own; the labelled group is the ConvertDiv root
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - A part of ConvertDiv; draws nothing and carries no strings of its own
    //
    // References:
    //   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ConvertFromUnitDiv.svelte -->
<div
    class={`convert-from-unit-div ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
