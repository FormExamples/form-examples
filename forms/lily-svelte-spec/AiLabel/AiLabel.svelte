<script lang="ts">
    // AiLabel component
    //
    // A headless inline indicator that communicates the presence of AI-generated
    // content and provides a pathway to AI explainability. Renders a <span> element
    // with visible text and accessible labelling. Used wherever AI is generating,
    // modifying, or enhancing content to reinforce AI transparency, accountability,
    // and explainability.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, default "AI". Accessible name via aria-label.
    //   text — string, default "AI". Visible text displayed inside the indicator.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AiLabel />
    //   <AiLabel text="AI generated" label="AI generated content" />
    //
    // Examples:
    //   <p>This summary was created by <AiLabel /> based on your documents.</p>
    //
    // Keyboard:
    //   - None at component level; wrap in <button> for interactive explainability
    //
    // Accessibility:
    //   - aria-label provides an accessible name for the AI indicator
    //
    // Internationalization:
    //   - The text and label props are the only user-facing strings
    //   - Consumer provides localized values for both props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Renders a bare <span> — no wrapper elements
    //
    // References:
    //   - Carbon Design System AI Label: https://carbondesignsystem.com/components/ai-label/usage/

    let {
        class: className = "",
        label = "AI",
        text = "AI",
        ...restProps
    }: {
        /** Accessible name for the indicator. */
        label?: string;
        /** Visible text displayed. */
        text?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AiLabel.svelte -->
<span
    class={`ai-label ${className}`}
    aria-label={label}
    {...restProps}
>{text}</span>
