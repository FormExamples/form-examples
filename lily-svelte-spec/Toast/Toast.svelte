<script lang="ts">
    // Toast component
    //
    // A headless notification toast that provides a brief, transient message to
    // the user via ARIA live regions. Uses role="status" with aria-live="polite"
    // by default, or role="alert" with aria-live="assertive" for urgent messages.
    // Toasts are typically used for success confirmations, error messages, and
    // informational updates without requiring user interaction.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, default undefined. Optional accessible label via aria-label.
    //   urgent — boolean, default false. When true, uses role="alert" and aria-live="assertive".
    //   children — Snippet, required. The toast message content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Toast label="Success">Your changes have been saved.</Toast>
    //
    // Examples:
    //   <!-- Urgent error toast -->
    //   <Toast label="Error" urgent>Something went wrong.</Toast>
    //
    //   <!-- Informational toast -->
    //   <Toast label="Info">
    //     <p>3 new messages in your inbox.</p>
    //   </Toast>
    //
    // Keyboard:
    //   - None -- passive notification container; announced via live regions
    //
    // Accessibility:
    //   - role="status" (default) for polite announcements at the next graceful opportunity
    //   - role="alert" (when urgent) for immediate, time-sensitive announcements
    //   - aria-live="polite" (default) waits for a pause before announcing
    //   - aria-live="assertive" (when urgent) interrupts current speech
    //   - aria-label provides optional descriptive label for the toast region
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All toast content is provided through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The urgent prop controls both role and aria-live simultaneously
    //
    // References:
    //   - WAI-ARIA Alert Role: https://www.w3.org/TR/wai-aria-1.2/#alert
    //   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
    //   - WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        urgent = false,
        children,
        ...restProps
    }: {
        /** Optional accessible label. */
        label?: string;
        /** Whether to use alert role instead of status. */
        urgent?: boolean;
        /** Toast content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Toast.svelte -->
<div
    class={`toast ${className}`}
    role={urgent ? "alert" : "status"}
    aria-label={label}
    aria-live={urgent ? "assertive" : "polite"}
    {...restProps}
>
    {@render children?.()}
</div>
