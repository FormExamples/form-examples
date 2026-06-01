<script lang="ts">
    // OverlayContainer component
    //
    // A headless full-viewport overlay backdrop for modals and sheets. Renders a
    // `<div role="presentation">` that hides via the `hidden` attribute when
    // `open` is false. The overlay itself contributes no visual styling — the
    // actual modal child should provide its own role="dialog" semantics.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   open — boolean, default false. Whether the overlay is visible.
    //   label — string, optional. aria-label.
    //   onclick — (event: MouseEvent) => void, optional. Backdrop click handler.
    //   children — Snippet, required. Overlay content (typically a modal).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <OverlayContainer open={isOpen} onclick={close}>…</OverlayContainer>
    //
    // Examples:
    //   <OverlayContainer open={modalOpen} label="Modal backdrop" onclick={close}>
    //     <div role="dialog" aria-modal="true">…</div>
    //   </OverlayContainer>
    //
    // Keyboard:
    //   - None directly; the modal child should manage focus and Escape
    //
    // Accessibility:
    //   - role="presentation" so the overlay does not pollute the accessibility tree
    //   - aria-hidden mirrors !open
    //   - hidden attribute removes from layout when closed
    //
    // Internationalization:
    //   - Label comes from the consumer
    //
    // Claude rules:
    //   - Headless: no styles, no positioning
    //   - Consumer is responsible for fixed positioning, backdrop color, z-index
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        open = false,
        label = undefined,
        onclick = undefined,
        children,
        ...restProps
    }: {
        /** Whether the overlay is open */
        open?: boolean;
        /** aria-label */
        label?: string;
        /** Click handler (typically backdrop-close) */
        onclick?: (event: MouseEvent) => void;
        /** Overlay content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- OverlayContainer.svelte -->
<div
    class={`overlay-container ${className}`}
    role="presentation"
    data-open={open}
    aria-hidden={!open}
    hidden={!open}
    aria-label={label}
    {onclick}
    {...restProps}
>
    {@render children?.()}
</div>
