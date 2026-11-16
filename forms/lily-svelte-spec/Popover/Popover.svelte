<script lang="ts">
    // Popover component
    //
    // A headless dialog overlay that displays contextual information or actions near
    // the element that triggered it. It renders a <div popover="auto" role="dialog">:
    // the native Popover API puts it in the top layer while open and closes it on
    // Escape and on a click outside it (light dismiss), with no script. `open` is
    // $bindable() and follows the element's `toggle` event, so a light dismiss or a
    // command="toggle-popover" trigger keeps it in step. Unlike tooltips, popovers can contain rich interactive content such
    // as forms, buttons, or other controls. Commonly used for contextual menus,
    // information panels, and inline editing.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the popover dialog via aria-label.
    //   open — boolean, default false, bindable. Controls whether the popover is visible;
    //     set to false when the browser closes it (Escape, light dismiss, a trigger).
    //   id — string, optional (rest prop). Give one so a trigger can name the popover
    //     with commandfor (or popovertarget).
    //   children — Snippet, required. The popover content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Popover label="Info" bind:open>{children}</Popover>
    //
    // Examples:
    //   <!-- Trigger with no script: the browser opens and closes the popover -->
    //   <button type="button" command="toggle-popover" commandfor="info-popover">Toggle info</button>
    //   <Popover id="info-popover" label="Additional information" bind:open={showPopover}>
    //     <p>Here is some contextual information.</p>
    //     <button type="button" command="hide-popover" commandfor="info-popover">Close</button>
    //   </Popover>
    //
    // Keyboard:
    //   - Escape: the browser closes the popover (Popover API); where the API is missing,
    //     the consumer closes it by setting open to false
    //   - Tab: not trapped; a popover is non-modal (use Dialog for a modal)
    //
    // Accessibility:
    //   - role="dialog" identifies the popover as a dialog overlay
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
    import { popoverState, toggleOpened } from "./popover.js";
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

    $effect(() =>
        warnMissingName("Popover", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );
</script>

<!-- Popover.svelte -->
<!-- popover="auto": top layer, light dismiss and Escape from the browser; popoverState opens and closes it from
     `open` (or sets `hidden` where the Popover API is missing), and the toggle event writes the browser's changes
     back to `open`. -->
<div
    class={`popover ${className}`}
    role="dialog"
    aria-label={label}
    popover="auto"
    use:popoverState={open}
    ontoggle={(event) => (open = toggleOpened(event))}
    {...restProps}
>
    {@render children?.()}
</div>
