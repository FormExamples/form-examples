<script lang="ts">
    // Question component
    //
    // The question half of a question-and-answer pair; pair it with `answer`. Renders a <div> with the
    // `question` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The question text.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Question label="…">…</Question>
    //
    // Examples:
    //   <Question>What is a design system?</Question>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

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

<!-- Question.svelte -->
<div
    class={`question ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
