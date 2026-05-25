<script lang="ts">
    // Hint component
    //
    // A hint provides subtle, contextual guidance text associated with a form control.
    // Typically displayed near an input field to clarify expected formats, explain
    // functionality, or offer examples. Renders a <p> element with an optional id for
    // linking to a form control via aria-describedby on the input element.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   id — string, default undefined. ID for linking via aria-describedby on the associated form control.
    //   children — Snippet, required. Hint text content.
    //   ...restProps — additional HTML attributes spread onto the p element.
    //
    // Syntax:
    //   <Hint id="email-hint">Enter your work email</Hint>
    //
    // Examples:
    //   <!-- Hint linked to an input via aria-describedby -->
    //   <Hint id="email-hint">Enter your work email</Hint>
    //   <input aria-describedby="email-hint" />
    //
    //   <!-- Password hint -->
    //   <Hint id="password-hint">Must be at least 8 characters</Hint>
    //   <input type="password" aria-describedby="password-hint" />
    //
    // Keyboard:
    //   - None — this is a passive text element; announced by screen readers when the associated control receives focus
    //
    // Accessibility:
    //   - The id attribute provides a target for aria-describedby on the associated form control
    //   - Screen readers announce the hint text when the linked input receives focus
    //
    // Internationalization:
    //   - All text content comes through the children snippet; no hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - The consumer is responsible for adding aria-describedby to the associated input
    //   - Renders a <p> element, not a <span> or <div>
    //
    // References:
    //   - WAI Forms Tutorial - Instructions: https://www.w3.org/WAI/tutorials/forms/instructions/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        id = undefined,
        children,
        ...restProps
    }: {
        id?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Hint.svelte -->
<p
    class={`hint ${className}`}
    {id}
    {...restProps}
>
    {@render children?.()}
</p>
