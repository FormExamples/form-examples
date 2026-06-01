<script lang="ts">
    // Coachmark component
    //
    // An anchored popover that spotlights and explains a single feature.
    // Renders a `<div>` with `role="dialog"` and `aria-modal="false"`.
    // The dialog is labelled by an internal heading and (optionally)
    // described by an internal paragraph; both ids are auto-generated.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   open — boolean, default false. Whether the coachmark is visible.
    //   title — string, REQUIRED. Heading text.
    //   description — string, optional. Body text.
    //   dismissLabel — string, REQUIRED. aria-label for the dismiss button.
    //   onDismiss — () => void, optional. Dismiss click handler.
    //
    // Syntax:
    //   <Coachmark
    //       open={visible}
    //       title="New feature"
    //       description="Try the new dashboard."
    //       dismissLabel="Dismiss"
    //       onDismiss={hide}
    //   />
    //
    // Accessibility:
    //   - role="dialog" with aria-modal="false" (non-modal popover dialog)
    //   - aria-labelledby points at the heading
    //   - aria-describedby points at the description (when provided)
    //   - hidden attribute removes the closed coachmark from the AT tree
    //
    // Internationalization:
    //   - All user-facing strings via props
    //
    // References:
    //   - Adobe Spectrum Coachmark: https://spectrum.adobe.com/page/coach-mark/
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    function makeId(prefix: string): string {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return `${prefix}-${crypto.randomUUID()}`;
        }
        return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
    }

    let {
        class: className = "",
        open = false,
        title,
        description = undefined,
        dismissLabel,
        onDismiss = undefined,
        ...restProps
    }: {
        class?: string;
        /** Whether the coachmark is visible */
        open?: boolean;
        /** Heading text (REQUIRED) */
        title: string;
        /** Body text */
        description?: string;
        /** Accessible label for dismiss (REQUIRED) */
        dismissLabel: string;
        /** Dismiss click handler */
        onDismiss?: () => void;
        [key: string]: unknown;
    } = $props();

    const titleId = makeId("coachmark-title");
    const descId = makeId("coachmark-desc");
</script>

<!-- Coachmark.svelte -->
<div
    class={`coachmark ${className}`}
    role="dialog"
    aria-modal="false"
    aria-labelledby={titleId}
    aria-describedby={description ? descId : undefined}
    hidden={!open}
    {...restProps}
>
    <h2 class="coachmark-title" id={titleId}>{title}</h2>
    {#if description}
        <p class="coachmark-description" id={descId}>{description}</p>
    {/if}
    <button
        class="coachmark-dismiss"
        type="button"
        aria-label={dismissLabel}
        onclick={onDismiss}
    >×</button>
</div>
