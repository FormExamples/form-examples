<script lang="ts">
    // MenuBar component
    //
    // A headless horizontal menu bar using the ARIA menubar role, typically found
    // at the top of an application window. It renders a <div> with role="menubar"
    // and manages horizontal focus movement between top-level menu items via
    // ArrowLeft/ArrowRight keys, mimicking desktop application menu bars (e.g.,
    // File, Edit, View). Each top-level item may open a submenu or trigger an action.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name applied via aria-label.
    //   children — Snippet, required. MenuBarButton elements.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <MenuBar label="Main menu">
    //     <MenuBarButton>File</MenuBarButton>
    //   </MenuBar>
    //
    // Examples:
    //   <!-- Basic application menu bar -->
    //   <MenuBar label="Main menu">
    //     <MenuBarButton>File</MenuBarButton>
    //     <MenuBarButton>Edit</MenuBarButton>
    //     <MenuBarButton>View</MenuBarButton>
    //   </MenuBar>
    //
    // Keyboard:
    //   - ArrowRight: move focus to next menu bar item, wrapping from last to first
    //   - ArrowLeft: move focus to previous menu bar item, wrapping from first to last
    //   - Home: move focus to the first menu bar item
    //   - End: move focus to the last menu bar item
    //
    // Accessibility:
    //   - role="menubar" identifies the container as a horizontal menu bar widget
    //   - aria-label provides an accessible name describing the menu bar purpose
    //   - Child MenuBarButton elements provide role="menuitem" with tabindex="-1"
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All menu bar item content comes through the children snippet
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: pair with MenuBarButton for individual entries
    //   - Uses horizontal (ArrowLeft/ArrowRight) navigation, not vertical
    //   - Arrow keys wrap around at boundaries
    //
    // References:
    //   - WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** MenuBarButton elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let barRef: HTMLElement | undefined = $state(undefined);

    function onkeydown(event: KeyboardEvent) {
        if (!barRef) return;
        const items = Array.from(
            barRef.querySelectorAll<HTMLElement>("[role='menuitem']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    }
</script>

<!-- MenuBar.svelte -->
<div
    class={`menu-bar ${className}`}
    role="menubar"
    aria-label={label}
    bind:this={barRef}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</div>
