<script lang="ts">
    // BeachBall component
    //
    // A headless loading/waiting indicator inspired by the macOS spinning beach
    // ball cursor. Renders a <div> with role="status" and an inner <span> animation
    // target when active. Commonly used to indicate background processing, page
    // loads, or any busy state where the system is working on a task.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible description of what is loading, applied via aria-label.
    //   active — boolean, default true. Whether the loading indicator is currently active.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <BeachBall label="Loading content" />
    //
    // Examples:
    //   <!-- Conditional loading indicator -->
    //   <BeachBall label="Processing request" active={isLoading} />
    //
    //   <!-- Always-visible loading indicator -->
    //   <BeachBall label="Fetching data" />
    //
    // Keyboard:
    //   None — this is a passive informational indicator, not interactive.
    //
    // Accessibility:
    //   - role="status" identifies this as a status region for screen readers
    //   - aria-live="polite" announces loading state changes without interrupting the user
    //   - aria-busy reflects the active prop, signaling loading in progress
    //   - aria-label describes what is loading, set from the label prop
    //   - data-active attribute mirrors the active state for CSS selectors
    //
    // Internationalization:
    //   - All text comes through the label prop; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Inner <span aria-hidden="true"> is the animation target; consumer applies spin/pulse CSS
    //   - The <span> is only rendered when active is true
    //
    // References:
    //   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
    //   - ARIA aria-busy: https://www.w3.org/TR/wai-aria-1.2/#aria-busy

    let {
        class: className = "",
        label,
        active = true,
        ...restProps
    }: {
        /** Accessible label describing what is loading */
        label: string;
        /** Whether the loading indicator is active */
        active?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- BeachBall.svelte -->
<div
    class={`beach-ball ${className}`}
    role="status"
    aria-label={label}
    aria-busy={active}
    aria-live="polite"
    data-active={active}
    {...restProps}
>
    {#if active}
        <span aria-hidden="true"></span>
    {/if}
</div>
