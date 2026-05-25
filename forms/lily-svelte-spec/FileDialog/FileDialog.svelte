<script lang="ts">
    // FileDialog component
    //
    // A modal dialog for file-related operations such as opening, saving, or
    // managing files. Renders a native <dialog> element conditionally based on
    // the open state, with accessible labeling and Escape key dismissal. Useful
    // in file managers, document editors, and content management systems where
    // the consumer provides file lists, action buttons, and navigation as children.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the dialog.
    //   open — boolean, default false. Whether the dialog is visible; bindable.
    //   children — Snippet, required. Dialog content.
    //   ...restProps — additional HTML attributes spread onto the <dialog> element.
    //
    // Syntax:
    //   <FileDialog label="Open file" bind:open>Content</FileDialog>
    //
    // Examples:
    //   <!-- File open dialog -->
    //   <FileDialog label="Open file" bind:open>
    //     <ul>
    //       <li>document.txt</li>
    //       <li>image.png</li>
    //     </ul>
    //     <button onclick={() => open = false}>Cancel</button>
    //   </FileDialog>
    //
    // Keyboard:
    //   - Escape: closes the dialog by setting open to false
    //
    // Accessibility:
    //   - aria-label provides the accessible name
    //   - Native <dialog> element provides implicit role="dialog"
    //   - tabindex="-1" allows programmatic focus management
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Dialog removed from DOM when open is false
    //   - Uses $bindable() on open for two-way state binding
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
    //   - MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        open = $bindable(false),
        children,
        ...restProps
    }: {
        label: string;
        open?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            open = false;
        }
    }
</script>

<!-- FileDialog.svelte -->
{#if open}
    <dialog
        class={`file-dialog ${className}`}
        open
        tabindex="-1"
        aria-label={label}
        {onkeydown}
        {...restProps}
    >
        {@render children?.()}
    </dialog>
{/if}
