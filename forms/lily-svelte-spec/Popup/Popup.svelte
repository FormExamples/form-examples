<script lang="ts">
    // Popup component
    //
    // A headless overlay dialog that temporarily appears over the main
    // content to convey information, prompt user actions, or display additional
    // options. It renders a <div popover="auto" role="dialog">: the native Popover
    // API puts it in the top layer while open and closes it on Escape and on a click
    // outside it (light dismiss), with no script. `open` is $bindable() and follows
    // the element's `toggle` event. Similar to Popover but designed as a
    // general-purpose overlay dialog.
    // Commonly used for confirmations, prompts, contextual actions, and inline forms.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the popup dialog via aria-label.
    //   open — boolean, default false, bindable. Controls whether the popup is visible;
    //     set to false when the browser closes it (Escape, light dismiss, a trigger).
    //   id — string, optional (rest prop). Give one so a trigger can name the popup
    //     with commandfor (or popovertarget).
    //   children — Snippet, required. Content rendered inside the dialog.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Popup label="Info" bind:open>{children}</Popup>
    //
    // Examples:
    //   <!-- Trigger with no script: the browser opens and closes the popup -->
    //   <button type="button" command="toggle-popover" commandfor="info-popup">Toggle info</button>
    //   <Popup id="info-popup" label="Additional information" bind:open={showPopup}>
    //     <p>Here is some contextual information.</p>
    //     <button type="button" command="hide-popover" commandfor="info-popup">Close</button>
    //   </Popup>
    //
    // Keyboard:
    //   - Escape: the browser closes the popup (Popover API); where the API is missing,
    //     the consumer closes it by setting open to false
    //   - Tab: not trapped; a popover is non-modal (use Dialog for a modal)
    //
    // Accessibility:
    //   - role="dialog" identifies the popup as a dialog overlay
    //   - aria-label provides the accessible name for the dialog
    //   - Always in the DOM, so a trigger can reference its id; closed it is not
    //     displayed (the popover UA style, or `hidden` where the API is missing)
    //
    // Internationalization:
    //   - The label prop is the only text; all content comes through children
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer provides the trigger (command="toggle-popover" commandfor={id})
    //   - Native first: popover="auto"; scripted fallback via ./popover.ts (Popover) when
    //     showPopover is missing. No focus trapping — a popover is non-modal
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
    //   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
    //   - HTML popover attribute: https://html.spec.whatwg.org/multipage/popover.html
    //   - MDN Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import { popoverState, toggleOpened } from "../Popover/popover.js";

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

    $effect(() =>
        warnMissingName("Popup", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );
</script>

<!-- Popup.svelte -->
<!-- popover="auto": top layer, light dismiss and Escape from the browser; popoverState opens and closes it from
     `open` (or sets `hidden` where the Popover API is missing), and the toggle event writes the browser's changes
     back to `open`. -->
<div
    class={`popup ${className}`}
    role="dialog"
    aria-label={label}
    popover="auto"
    use:popoverState={open}
    ontoggle={(event) => (open = toggleOpened(event))}
    {...restProps}
>
    {@render children?.()}
</div>
