<script lang="ts">
    // TimeoutDialog component
    //
    // A dialog warning that a session is about to time out. Renders a <dialog role="alertdialog"> with the
    // `timeout-dialog` hook that is always in the DOM and shown as a real modal (showModal) while `open`
    // is true; the countdown and the buttons are the consumer's.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   open — boolean, default false. Opens the modal when true and closes it when false.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <dialog>.
    //
    // Syntax:
    //   <TimeoutDialog label="…" {open}>…</TimeoutDialog>
    //
    // Examples:
    //   <TimeoutDialog label="Session about to expire" open={warning}><p>You will be signed out in 2 minutes.</p><button onclick={stay}>Stay signed in</button></TimeoutDialog>
    //
    // Keyboard:
    //   - Escape: closes the modal (native <dialog> behaviour); the `open` prop is not written back, so update it from a close handler
    //   - Tab: stays inside the dialog while it is modal
    //
    // Accessibility:
    //   - role="alertdialog" with aria-label from `label`
    //   - showModal() makes the page behind inert, traps focus and returns focus to the opener on close
    //   - Where showModal is missing (jsdom, older browsers) it falls back to the open attribute without those guarantees
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Native first: a real <dialog>; the effect only syncs `open` with the element
    //
    // References:
    //   - WAI-ARIA alertdialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
    //   - MDN <dialog>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        open = false,
        children,
        ...restProps
    }: {
        label?: string;
        open?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    // Always rendered, shown while `open`: as a real modal where the browser has one (see Dialog/modal.ts).
    let el: HTMLDialogElement | undefined = $state(undefined);
    $effect(() => {
        if (!el) return;
        if (open && !el.open) {
            if (typeof el.showModal === "function") el.showModal();
            else el.setAttribute("open", "");
        } else if (!open && el.open) {
            if (typeof el.close === "function") el.close();
            else el.removeAttribute("open");
        }
    });
</script>

<!-- TimeoutDialog.svelte -->
<dialog
    class={`timeout-dialog ${className}`}
    role="alertdialog"
    aria-label={label}
    bind:this={el}
    {...restProps}
>
    {@render children?.()}
</dialog>
