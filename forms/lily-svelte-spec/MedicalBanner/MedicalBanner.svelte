<script lang="ts">
    // MedicalBanner component
    //
    // A headless medical banner for displaying prominent medical information
    // messages at the top of a page. Renders as a <div role="region"> with
    // aria-live="polite", data-type for variants, and data-context="medical".
    // Supports optional dismiss functionality. Commonly used for patient alerts,
    // clinical notifications, and medical record summaries.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   type — "info" | "success" | "warning" | "error", default "info".
    //   dismissible — boolean, default false.
    //   onclose — () => void, optional. Callback when dismissed.
    //   closeLabel — string, optional. Accessible label for dismiss button.
    //   children — Snippet, required. The banner content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <MedicalBanner label="Patient alerts">content</MedicalBanner>
    //
    // Keyboard:
    //   - Tab: Focus dismiss button (when dismissible)
    //   - Enter/Space: Dismiss the banner
    //
    // Accessibility:
    //   - role="region" for landmark identification
    //   - aria-live="polite" for announcing content changes
    //   - data-context="medical" for medical context
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        type = "info",
        dismissible = false,
        onclose = undefined,
        closeLabel = undefined,
        children,
        ...restProps
    }: {
        label: string;
        type?: "info" | "success" | "warning" | "error";
        dismissible?: boolean;
        onclose?: () => void;
        closeLabel?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let visible = $state(true);

    function dismiss() {
        visible = false;
        onclose?.();
    }
</script>

<!-- MedicalBanner.svelte -->
{#if visible}
    <div
        class={`medical-banner ${className}`}
        role="region"
        aria-live="polite"
        aria-label={label}
        data-type={type}
        data-context="medical"
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
