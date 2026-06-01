<script lang="ts">
    // ProgressSpinner component
    //
    // A headless indeterminate loading indicator that renders a <div> with
    // role="status" and aria-live="polite" to announce the loading state to screen
    // readers without interrupting the user. Unlike ProgressCircle which shows a
    // specific percentage, ProgressSpinner indicates an ongoing process of unknown
    // duration. Consumers provide their own spinning animation via CSS. Commonly
    // used for data fetching, form submissions, and async operations.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the loading state via aria-label.
    //   children — Snippet, optional. Content rendered inside (e.g., "Loading..." text).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ProgressSpinner label="Loading data" />
    //
    // Examples:
    //   <!-- Simple spinner with no visible text -->
    //   <ProgressSpinner label="Loading data" />
    //
    //   <!-- Spinner with visible loading text -->
    //   <ProgressSpinner label="Loading search results">
    //     <span>Loading...</span>
    //   </ProgressSpinner>
    //
    // Keyboard:
    //   None — this is a passive, read-only status indicator with no interactive behavior.
    //
    // Accessibility:
    //   - role="status" identifies the element as a status region for non-urgent updates
    //   - aria-label describes what is loading
    //   - aria-live="polite" ensures content changes are announced without interrupting
    //
    // Internationalization:
    //   - The label prop is the only user-facing text; no hardcoded strings
    //   - Optional visible text comes through children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling and animation
    //   - Do not add SVG, canvas, or animation — consumer provides the spinner visual
    //   - Uses role="status" not role="progressbar" because duration is indeterminate
    //
    // References:
    //   - WAI-ARIA status role: https://www.w3.org/WAI/ARIA/apd/roles/status/
    //   - MDN aria-live: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label for the spinner. */
        label: string;
        /** Optional content rendered inside. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ProgressSpinner.svelte -->
<div
    class={`progress-spinner ${className}`}
    role="status"
    aria-label={label}
    aria-live="polite"
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</div>
