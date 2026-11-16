<script lang="ts">
    // ContextualHelp component
    //
    // A help button that opens a popover with explanatory content. Renders a
    // wrapper `<div>` containing a `<button>` trigger (aria-haspopup="dialog",
    // aria-expanded, aria-controls) and a `<div role="dialog" popover="auto">`
    // panel. The trigger opens and closes the panel through the native Popover
    // API with command="toggle-popover" commandfor={panelId} (and popovertarget
    // for engines before command/commandfor), so open, Escape and light dismiss
    // need no script; the panel's `toggle` event keeps `expanded` in step. Where
    // the Popover API is missing (jsdom, old engines) the trigger's click toggles
    // `expanded` and the panel's `hidden` attribute instead.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the trigger button (its accessible name).
    //   triggerLabel — string, REQUIRED. Visible text of the trigger, such as "?" or "؟".
    //     No default: the glyph is the consumer's, per script and locale. Pass "" when
    //     the consumer's CSS draws an icon instead.
    //   expanded — boolean, default false, bindable. Whether the popover is open;
    //     set by the browser's toggle (trigger, Escape, light dismiss).
    //   onclick — (event: MouseEvent) => void, optional. Trigger click handler;
    //     call event.preventDefault() to stop the trigger toggling the panel.
    //   children — Snippet, optional. Popover content.
    //
    // Syntax:
    //   <ContextualHelp label="Help" triggerLabel="?" bind:expanded>
    //       <p>Help content</p>
    //   </ContextualHelp>
    //
    // Keyboard:
    //   - Enter / Space on the trigger toggles the panel
    //   - Escape closes the panel (browser, Popover API)
    //
    // Accessibility:
    //   - Trigger: aria-haspopup="dialog", aria-expanded, aria-controls
    //   - Panel: role="dialog", id matched by aria-controls and commandfor
    //
    // Internationalization:
    //   - All user-facing strings via props: label (accessible name) and
    //     triggerLabel (visible glyph or text)
    //
    // References:
    //   - Adobe Spectrum ContextualHelp: https://spectrum.adobe.com/page/contextual-help/
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
    //   - HTML command and commandfor: https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command

    import type { Snippet } from "svelte";
    import { popoverState, popoverSupported, toggleOpened } from "../Popover/popover.js";

    let {
        class: className = "",
        label,
        triggerLabel,
        expanded = $bindable(false),
        onclick = undefined,
        children = undefined,
        ...restProps
    }: {
        class?: string;
        /** Accessible label for the trigger (REQUIRED) */
        label: string;
        /** Visible text of the trigger, such as "?" (REQUIRED; no default) */
        triggerLabel: string;
        /** Whether the popover is open. Bindable. */
        expanded?: boolean;
        /** Trigger click handler */
        onclick?: (event: MouseEvent) => void;
        /** Popover content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    // Hydration-stable: the server and the client agree on it, so commandfor still names the panel.
    const uid = $props.id();
    const panelId = `contextual-help-panel-${uid}`;
    let panel: HTMLDivElement | undefined = $state();

    function toggle(event: MouseEvent) {
        onclick?.(event);
        if (event.defaultPrevented) return;
        // With the Popover API the browser toggles the panel (command / popovertarget) and the toggle event
        // updates `expanded`; without it, toggle here.
        if (panel && !popoverSupported(panel)) expanded = !expanded;
    }
</script>

<!-- ContextualHelp.svelte -->
<div
    class={`contextual-help ${className}`}
    {...restProps}
>
    <button
        class="contextual-help-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={panelId}
        command="toggle-popover"
        commandfor={panelId}
        popovertarget={panelId}
        onclick={toggle}>{triggerLabel}</button
    >
    <div
        bind:this={panel}
        class="contextual-help-panel"
        id={panelId}
        role="dialog"
        aria-label={label}
        popover="auto"
        use:popoverState={expanded}
        ontoggle={(event) => (expanded = toggleOpened(event))}
    >
        {#if children}
            {@render children?.()}
        {/if}
    </div>
</div>
