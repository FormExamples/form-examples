<script lang="ts">
    // Popup component
    //
    // A headless conditional overlay dialog that temporarily appears over the main
    // content to convey information, prompt user actions, or display additional
    // options. It renders a <div> with role="dialog" only when the open state is
    // true. Similar to Popover but designed as a general-purpose overlay dialog.
    // Commonly used for confirmations, prompts, contextual actions, and inline forms.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the popup dialog via aria-label.
    //   open — boolean, default false, bindable. Controls whether the popup is visible.
    //   children — Snippet, required. Content rendered inside the dialog.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Popup label="Info" bind:open>{children}</Popup>
    //
    // Examples:
    //   <!-- Confirmation popup -->
    //   <button onclick={() => showPopup = !showPopup}>Open popup</button>
    //   <Popup label="Confirmation" bind:open={showPopup}>
    //     <p>Are you sure you want to proceed?</p>
    //     <button onclick={() => showPopup = false}>Yes</button>
    //     <button onclick={() => showPopup = false}>No</button>
    //   </Popup>
    //
    // Keyboard:
    //   - Escape: consumer should implement closing the popup by setting open to false
    //   - Tab: consumer should consider trapping focus within the popup when open
    //
    // Accessibility:
    //   - role="dialog" identifies the popup as a dialog overlay
    //   - aria-label provides the accessible name for the dialog
    //   - Conditionally rendered; not in the DOM when closed
    //
    // Internationalization:
    //   - The label prop is the only text; all content comes through children
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer must provide trigger element and open/close logic
    //   - Do not add focus trapping or Escape handling — consumer responsibility
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
    //   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        open = $bindable(false),
        children,
        ...restProps
    }: {
        /** Accessible label for the popup dialog. */
        label: string;
        /** Whether the popup is visible. Bindable. */
        open?: boolean;
        /** Content rendered inside the popup. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Popup.svelte -->
{#if open}
    <div
        class={`popup ${className}`}
        role="dialog"
        aria-label={label}
        {...restProps}
    >
        {@render children?.()}
    </div>
{/if}
