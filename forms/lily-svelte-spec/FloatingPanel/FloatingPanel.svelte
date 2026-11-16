<script lang="ts">
    // FloatingPanel component
    //
    // A floating panel container that overlays page content, typically used for tooltips,
    // popovers, dropdown menus, or contextual UI. It is always rendered as a popover="manual", shown according to an
    // open prop, display: none when closed. Consumers are responsible
    // for positioning the panel relative to a trigger element using their own CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   open — boolean, default false. Whether the panel is visible.
    //   label — string, required. Accessible name for the panel region via aria-label.
    //   children — Snippet, required. Panel content to render inside.
    //   ...restProps — additional HTML attributes spread onto the div.
    //
    // Syntax:
    //   <FloatingPanel open={showPanel} label="Options">{children}</FloatingPanel>
    //
    // Examples:
    //   <!-- Conditionally shown options panel -->
    //   <FloatingPanel open={showPanel} label="Options">
    //     <p>Panel content</p>
    //   </FloatingPanel>
    //
    //   <!-- Floating filter panel -->
    //   <FloatingPanel open={filtersVisible} label="Filters">
    //     <form>...</form>
    //   </FloatingPanel>
    //
    // Keyboard:
    //   - None — this is a passive container; consumers should implement focus management and Escape-to-close as needed
    //
    // Accessibility:
    //   - role="region" identifies the panel as a landmark region
    //   - aria-label provides an accessible name for the region
    //
    // Internationalization:
    //   - The label prop allows localized accessible names; no hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling and positioning
    //   - Native first: popover="manual" (top layer) opened and closed by the `open` state through ./Popover/popover.ts; where the Popover API is missing (jsdom, older browsers) it falls back to the `hidden` attribute. Placement is the theme's CSS (anchor positioning); light dismiss and Escape stay the consumer's.
    //   - Consumer manages show/hide logic externally
    //
    // References:
    //   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

    import type { Snippet } from "svelte";

    import { popoverState } from "../Popover/popover.js";

    let {
        class: className = "",
        open = false,
        label,
        children,
        ...restProps
    }: {
        /** Whether the panel is visible. */
        open?: boolean;
        /** Accessible name. */
        label: string;
        /** Panel content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- FloatingPanel.svelte -->
<div
    class={`floating-panel ${className}`}
    role="region"
    popover="manual"
    use:popoverState={open}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
