<script lang="ts">
    // Answer component
    //
    // The answer half of a question-and-answer pair. A container with an optional accessible name; pair it
    // with the `question` component.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The answer content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Answer label="…">…</Answer>
    //
    // Examples:
    //   <Question>What is a design system?</Question>
    //   <Answer><p>A shared set of rules and components.</p></Answer>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given; use it when no visible heading names the answer
    //   - With a label the root is role="group", because a plain <div> cannot be named
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Pairs with Question; the pairing is by position in the page, not by ids
    //
    // References:
    //   - MDN aria-label: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Answer.svelte -->
<div
    class={`answer ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
