<script lang="ts">
    // Collapsible component
    //
    // A headless collapsible disclosure component built on native HTML <details> and
    // <summary> elements. Users click the summary text to expand or collapse the
    // content section. The open prop is bindable, enabling parent components to
    // programmatically control or observe the expanded/collapsed state. Commonly used
    // for FAQ sections, advanced settings, and progressive disclosure patterns.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   summary — string, required. The clickable summary text shown as the toggle trigger.
    //   open — boolean, default false. Whether the content is expanded; bindable for two-way control.
    //   children — Snippet, required. The collapsible content revealed when expanded.
    //   ...restProps — additional HTML attributes spread onto the <details>.
    //
    // Syntax:
    //   <Collapsible summary="More info">Content here</Collapsible>
    //
    // Examples:
    //   <!-- Bindable open state for external control -->
    //   <Collapsible summary="Advanced settings" bind:open={showAdvanced}>
    //     <p>Advanced configuration options here.</p>
    //   </Collapsible>
    //
    // Keyboard:
    //   - Enter: Toggle the disclosure open/closed (handled natively by <summary>)
    //   - Space: Toggle the disclosure open/closed (handled natively by <summary>)
    //
    // Accessibility:
    //   - Native <details>/<summary> elements provide built-in expanded/collapsed state announcements
    //   - No custom ARIA attributes needed; the browser handles all screen reader semantics
    //
    // Internationalization:
    //   - The summary prop provides the toggle label; no hardcoded strings
    //   - All content is provided through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses native <details>/<summary> — do not replace with custom ARIA disclosure
    //   - The open prop uses $bindable(false) for two-way binding with bind:open
    //
    // References:
    //   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        summary,
        open = $bindable(false),
        children,
        ...restProps
    }: {
        /** The clickable summary text */
        summary: string;
        /** Whether the content is expanded */
        open?: boolean;
        /** The collapsible content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Collapsible.svelte -->
<details
    class={`collapsible ${className}`}
    bind:open
    {...restProps}
>
    <summary>{summary}</summary>
    {@render children?.()}
</details>
