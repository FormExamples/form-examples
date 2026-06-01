<script lang="ts">
    // SplitButton component
    //
    // A headless button with a primary action and a dropdown for related actions.
    // Renders a `<div role="group">` containing two native `<button>` elements
    // (primary action and menu trigger) and a menu container hidden via the
    // `hidden` attribute when `menuOpen` is false. The menu content goes in the
    // `children` snippet.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the group.
    //   primaryLabel — string, REQUIRED. Primary action button label.
    //   menuLabel — string, REQUIRED. Accessible label for the menu trigger.
    //   menuOpen — boolean, default false. Whether the menu is open.
    //   disabled — boolean, default false. Disables both buttons.
    //   onprimaryclick — (event: MouseEvent) => void, optional. Primary handler.
    //   onmenutoggle — (event: MouseEvent) => void, optional. Menu toggle handler.
    //   children — Snippet, required. The menu content (typically a Menu component).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <SplitButton label="Save options" primaryLabel="Save" menuLabel="More save options"
    //     menuOpen={open} onprimaryclick={save} onmenutoggle={toggle}>
    //     <Menu>…</Menu>
    //   </SplitButton>
    //
    // Examples:
    //   <SplitButton label="Export" primaryLabel="Export PDF" menuLabel="More export options"
    //     menuOpen={isOpen} onprimaryclick={exportPdf} onmenutoggle={() => isOpen = !isOpen}>
    //     <ul role="menu">…</ul>
    //   </SplitButton>
    //
    // Keyboard:
    //   - Tab: Focus moves between primary and trigger
    //   - Enter / Space: Activates focused button
    //   - Escape: Consumer should close the menu
    //
    // Accessibility:
    //   - role="group" with aria-label
    //   - aria-haspopup="menu" and aria-expanded on the trigger button
    //   - Menu container hidden when closed
    //
    // Internationalization:
    //   - All button labels come through props
    //
    // Claude rules:
    //   - Headless: no styles, no chevron glyph
    //   - Consumer manages menuOpen state
    //
    // References:
    //   - WAI-ARIA Menu Button: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        primaryLabel,
        menuLabel,
        menuOpen = false,
        disabled = false,
        onprimaryclick = undefined,
        onmenutoggle = undefined,
        children,
        ...restProps
    }: {
        /** Accessible label for the group (required) */
        label: string;
        /** Primary action button label (required) */
        primaryLabel: string;
        /** Accessible label for the menu trigger (required) */
        menuLabel: string;
        /** Whether the dropdown menu is open */
        menuOpen?: boolean;
        /** Whether both buttons are disabled */
        disabled?: boolean;
        /** Primary action handler */
        onprimaryclick?: (event: MouseEvent) => void;
        /** Menu toggle handler */
        onmenutoggle?: (event: MouseEvent) => void;
        /** The menu content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SplitButton.svelte -->
<div
    class={`split-button ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    <button
        class="split-button-primary"
        type="button"
        {disabled}
        onclick={onprimaryclick}
    >
        {primaryLabel}
    </button>
    <button
        class="split-button-menu-trigger"
        type="button"
        {disabled}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label={menuLabel}
        onclick={onmenutoggle}
    ></button>
    <div class="split-button-menu" hidden={!menuOpen}>
        {@render children?.()}
    </div>
</div>
