<script lang="ts">
    // Expander component
    //
    // An expander that shows or hides additional content with a toggle button.
    // Similar to native <details>/<summary> but uses a <button> trigger with
    // aria-expanded and aria-controls for full control over behavior. Useful for
    // FAQ sections, collapsible panels, settings groups, and progressive disclosure.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Button text and accessible name for both the button and content region.
    //   expanded — boolean, default false. Whether the content is visible; bindable.
    //   children — Snippet, required. Expandable content rendered when expanded is true.
    //   ...restProps — additional HTML attributes spread onto the outer <div> wrapper.
    //
    // Syntax:
    //   <Expander label="Show details" bind:expanded>Content</Expander>
    //
    // Examples:
    //   <!-- Basic expander -->
    //   <Expander label="Show details" bind:expanded>
    //     <p>Details here...</p>
    //   </Expander>
    //
    //   <!-- Advanced settings panel -->
    //   <Expander label="Advanced settings" bind:expanded={showAdvanced}>
    //     <form>...</form>
    //   </Expander>
    //
    // Keyboard:
    //   - Enter: toggles the expander open/closed (native button behavior)
    //   - Space: toggles the expander open/closed (native button behavior)
    //   - Tab: moves focus to/from the toggle button
    //
    // Accessibility:
    //   - aria-expanded on the button indicates whether content is visible
    //   - aria-controls references the ID of the expandable content region
    //   - role="region" on the content container identifies the expandable area
    //   - aria-label on the content region provides an accessible name
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Generates unique contentId via Math.random() for aria-controls/id link
    //   - Content removed from DOM when collapsed (not just hidden)
    //   - Uses $bindable() on expanded for two-way state binding
    //
    // References:
    //   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        expanded = $bindable(false),
        children,
        ...restProps
    }: {
        /** Button label / accessible name. */
        label: string;
        /** Whether the content is expanded. Bindable. */
        expanded?: boolean;
        /** Expandable content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const uid = $props.id();
    const contentId = `expander-${uid}`;
</script>

<div
    class={`expander ${className}`}
    {...restProps}
>
    <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onclick={() => (expanded = !expanded)}
    >
        {label}
    </button>
    {#if expanded}
        <div
            id={contentId}
            role="region"
            aria-label={label}
        >
            {@render children?.()}
        </div>
    {/if}
</div>
