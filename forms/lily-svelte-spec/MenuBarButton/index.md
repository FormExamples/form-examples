# MenuBarButton

MenuBarButton is a headless Svelte 5 single interactive item for a `MenuBar`. It renders a `<button type="button">` with `role="menuitem"` and `tabindex="-1"` so the parent `MenuBar` can manage roving focus.

## What it is

A button that participates in the WAI-ARIA menubar pattern. It is intentionally a real HTML `<button>` for native click/activation behaviour, but its tab order is controlled by the parent `MenuBar` through `tabindex="-1"`.

## What it does

- Renders a `<button>` with `class="menu-bar-button"` plus any consumer-provided CSS class.
- Sets `type="button"` to prevent accidental form submission.
- Sets `role="menuitem"` for ARIA menubar semantics.
- Sets `tabindex="-1"` so focus is managed by the parent `MenuBar` (roving tabindex).
- Renders the required `children` snippet as button content.
- Spreads `...restProps` onto the `<button>` — consumers typically pass `onclick`, `aria-haspopup`, `aria-expanded`, `disabled`, etc.

## When to use it

- Inside a `MenuBar` as one of the top-level menu entries (e.g., File, Edit, View).
- When each menu entry should open a submenu (`Menu`) or trigger an action.

## When not to use it

- Do not use outside a `MenuBar` — use `Button` for standalone buttons.
- Do not use as a menu item inside a vertical `Menu` — use `MenuItem` instead.
- Do not use as a tab — use `TabBarButton`.

## How to use it

Place `MenuBarButton` elements inside a `MenuBar`, one per top-level entry. Wire up `onclick` handlers that open submenus or trigger actions. Use `aria-haspopup` and `aria-expanded` when the button controls a submenu.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `menu-bar-button` class.
- `children` (Snippet, required) — content of the menu bar item.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<button>` (for example `onclick`, `disabled`, `aria-haspopup`, `aria-expanded`).

## Usage

### Basic menu bar composition

```svelte
<script lang="ts">
    import MenuBar from "../MenuBar/MenuBar.svelte";
    import MenuBarButton from "./MenuBarButton.svelte";
</script>

<MenuBar label="Main menu">
    <MenuBarButton>File</MenuBarButton>
    <MenuBarButton>Edit</MenuBarButton>
    <MenuBarButton>View</MenuBarButton>
</MenuBar>
```

### Button with click handler

```svelte
<script lang="ts">
    import MenuBar from "../MenuBar/MenuBar.svelte";
    import MenuBarButton from "./MenuBarButton.svelte";

    function openFileMenu() {
        console.log("open file menu");
    }
</script>

<MenuBar label="Main">
    <MenuBarButton onclick={openFileMenu}>File</MenuBarButton>
</MenuBar>
```

### Button opening a submenu with aria-haspopup + aria-expanded

```svelte
<script lang="ts">
    import MenuBar from "../MenuBar/MenuBar.svelte";
    import MenuBarButton from "./MenuBarButton.svelte";
    import Menu from "../Menu/Menu.svelte";
    import MenuItem from "../MenuItem/MenuItem.svelte";
    let open = $state(false);
</script>

<MenuBar label="Main">
    <MenuBarButton
        aria-haspopup="menu"
        aria-expanded={open}
        onclick={() => (open = !open)}
    >
        File
    </MenuBarButton>
</MenuBar>

{#if open}
    <Menu label="File">
        <MenuItem onclick={() => (open = false)}>New</MenuItem>
        <MenuItem onclick={() => (open = false)}>Open</MenuItem>
    </Menu>
{/if}
```

### Disabled button

```svelte
<script lang="ts">
    import MenuBar from "../MenuBar/MenuBar.svelte";
    import MenuBarButton from "./MenuBarButton.svelte";
</script>

<MenuBar label="Main">
    <MenuBarButton>File</MenuBarButton>
    <MenuBarButton disabled>Edit</MenuBarButton>
</MenuBar>
```

### Button with consumer styling

```svelte
<script lang="ts">
    import MenuBar from "../MenuBar/MenuBar.svelte";
    import MenuBarButton from "./MenuBarButton.svelte";
</script>

<MenuBar label="App">
    <MenuBarButton class="mb-btn">File</MenuBarButton>
    <MenuBarButton class="mb-btn">Edit</MenuBarButton>
</MenuBar>

<style>
    :global(.mb-btn) {
        padding: 0.25rem 0.75rem;
        border: none;
        background: transparent;
        cursor: pointer;
    }
    :global(.mb-btn:focus-visible) {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
    }
</style>
```

## Accessibility

- `role="menuitem"` identifies this button as an item within a menubar.
- `tabindex="-1"` removes the button from the default tab order; focus is managed by the parent `MenuBar` (roving tabindex).
- Consumers should provide `aria-haspopup="menu"` and `aria-expanded={open}` when the button controls a submenu.
- Native `<button>` keyboard behaviour (Enter/Space activates) is preserved.
- Compliant with WAI-ARIA 1.2 Menu Bar Pattern and WCAG 2.2 AAA with consumer-provided focus indicators.

## Related components

- `MenuBar` — the parent horizontal menubar container.
- `Menu` / `MenuItem` — vertical action menu, often opened from a `MenuBarButton`.
- `DropdownMenu` — a menu anchored below a trigger button.
- `TabBarButton` — a similar-looking horizontal button for tabs.
- `ToolBarButton` — a button within a toolbar.
- `Button` — a generic standalone clickable button.
