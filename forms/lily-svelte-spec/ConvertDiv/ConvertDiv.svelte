<script lang="ts">
    // ConvertDiv component
    //
    // The root of a converter that turns a value in one unit into another, such as dollars into euros or
    // miles into kilometres. Renders a <div role="group"> with the `convert-div` hook holding a
    // ConvertFromDiv and a ConvertIntoDiv. It converts nothing; the consumer does the arithmetic and
    // supplies any rates.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name. Rendered as aria-label on the group.
    //   children — Snippet, optional. The ConvertFromDiv and ConvertIntoDiv.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <ConvertDiv label="…">…</ConvertDiv>
    //
    // Examples:
    //   <ConvertDiv label="Convert currency"><ConvertFromDiv>…</ConvertFromDiv><ConvertIntoDiv>…</ConvertIntoDiv></ConvertDiv>
    //
    // Keyboard:
    //   - None of its own; Tab moves between the controls inside
    //
    // Accessibility:
    //   - role="group" with the required aria-label names the converter
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Worldwide: no currency or unit is defaulted; the consumer supplies them
    //   - Carries no strings of its own
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible name of the group (required). */
        label: string;

        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ConvertDiv.svelte -->
<div
    class={`convert-div ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
