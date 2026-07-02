<script lang="ts">
    // Banner component
    //
    // A headless banner for displaying prominent messages at the top or bottom
    // of an interface. Renders as a <div role="region"> with aria-live="polite"
    // and data-type for consumer styling. Supports optional dismiss functionality
    // with a close button. Commonly used for site announcements, cookie notices,
    // session warnings, and maintenance alerts.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   type        — "info" | "success" | "warning" | "error", default "info".
    //                 Semantic variant exposed as data-type.
    //   dismissible — boolean, default false. Whether the banner can be dismissed.
    //   onclose     — () => void, optional. Callback when the banner is dismissed.
    //   closeLabel  — string, optional. Accessible label for the dismiss button
    //                 (e.g., "Close banner" or "Dismiss").
    //   children    — Snippet, required. The banner content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Banner>Message</Banner>
    //   <Banner dismissible closeLabel="Close" onclose={handler}>Message</Banner>
    //
    // Examples:
    //   <!-- Simple info banner -->
    //   <Banner>Important announcement here.</Banner>
    //
    //   <!-- Dismissible warning banner -->
    //   <Banner type="warning" dismissible closeLabel="Dismiss"
    //     onclose={handleDismiss}>
    //     Your session will expire soon.
    //   </Banner>
    //
    //   <!-- Error banner with custom attributes -->
    //   <Banner type="error" data-testid="error-banner">
    //     Service unavailable. Please try again later.
    //   </Banner>
    //
    // Keyboard:
    //   - Tab: Focus the dismiss button (when dismissible)
    //   - Enter / Space: Activate the dismiss button
    //
    // Accessibility:
    //   - role="region" for landmark identification
    //   - aria-live="polite" for announcing content changes
    //   - Dismiss button has aria-label from closeLabel prop
    //   - data-type exposes variant for consumer styling
    //
    // Internationalization:
    //   - All text comes through children snippet and closeLabel prop
    //   - No hardcoded strings; consumer provides dismiss button label
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Internal visible state tracks dismissal; removed from DOM when dismissed
    //   - onclose callback fires after visibility is set to false
    //   - Consumer provides close button content/icon via closeLabel
    //   - data-type is for styling hooks, not semantics
    //
    // References:
    //   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        type = "info",
        dismissible = false,
        onclose = undefined,
        closeLabel = undefined,
        children,
        ...restProps
    }: {
        /** Banner variant for semantic meaning */
        type?: "info" | "success" | "warning" | "error";
        /** Whether the banner can be dismissed */
        dismissible?: boolean;
        /** Callback when the banner is dismissed */
        onclose?: () => void;
        /** Accessible label for the dismiss button */
        closeLabel?: string;
        /** The banner content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let visible = $state(true);

    function dismiss() {
        visible = false;
        onclose?.();
    }
</script>

<!-- Banner.svelte -->
{#if visible}
    <div
        class={`banner ${className}`}
        role="region"
        aria-live="polite"
        data-type={type}
        {...restProps}
    >
        {@render children?.()}
        {#if dismissible}
            <button
                type="button"
                aria-label={closeLabel}
                onclick={dismiss}
            ></button>
        {/if}
    </div>
{/if}
