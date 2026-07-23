# MenuItem

MenuItem is a headless Svelte 5 single action or option within a `Menu`, `DropdownMenu`, or similar menu container. It renders a `<div>` with `role="menuitem"` and `tabindex="-1"` for roving-focus keyboard navigation by the parent.

## What it is

A menu-item element that participates in the WAI-ARIA menu pattern. It is a `<div>` (not a `<button>`) because it is commonly rich content (text + shortcut hint + icon) within a menu; consumers wire interactivity via `onclick` / `onkeydown` passed through `restProps`.

## What it does

- Renders a `<div>` with `class="menu-item"` plus any consumer-provided CSS class.
- Sets `role="menuitem"` for ARIA semantics.
- Sets `tabindex="-1"` so focus is managed by the parent `Menu` (roving tabindex).
- Renders the required `children` snippet as the item content.
- Spreads `...restProps` onto the `<div>` — consumers typically pass `onclick`, `onkeydown`, `aria-disabled`, `aria-haspopup`, `aria-expanded`, etc.

## When to use it

- Inside a `Menu` or `DropdownMenu` as one of the actions.
- Inside context menus, submenus, or any WAI-ARIA `role="menu"` container.
- When you need a clickable item with rich content (labels, shortcut hints, icons).

## When not to use it

- Do not use as a button outside of a menu — use `Button` for standalone buttons.
- Do not use in a horizontal menubar — use `MenuBarButton`.
- Do not use in a list of selectable options — use a `role="option"` element inside `Listbox`.
- Do not use for navigation links — use an `<a>` inside `NavigationMenu` or `TreeNav`.

## How to use it

Place `MenuItem` elements inside a `Menu` (or another `role="menu"` container). Provide `onclick` and optionally `onkeydown` to handle Enter/Space activation.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `menu-item` class.
- `children` (Snippet, required) — menu-item content (text, shortcut hint, icon).
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>` (for example `onclick`, `onkeydown`, `aria-disabled`, `aria-haspopup`, `aria-expanded`).

## Usage

### Menu composition with MenuItem + arrow-key navigation

```svelte
<script lang="ts">
    import Menu from "../Menu/Menu.svelte";
    import MenuItem from "./MenuItem.svelte";
</script>

<Menu label="File">
    <MenuItem onclick={() => console.log("New")}>New File</MenuItem>
    <MenuItem onclick={() => console.log("Open")}>Open File</MenuItem>
    <MenuItem onclick={() => console.log("Save")}>Save</MenuItem>
</Menu>
```

The parent `Menu` handles ArrowDown/ArrowUp (wrapping) and Home/End.

### MenuItem with Enter/Space activation

```svelte
<script lang="ts">
    import Menu from "../Menu/Menu.svelte";
    import MenuItem from "./MenuItem.svelte";

    function activate() {
        console.log("activated");
    }
</script>

<Menu label="Actions">
    <MenuItem
        onclick={activate}
        onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                activate();
            }
        }}
    >
        Run
    </MenuItem>
</Menu>
```

### Disabled menu item

```svelte
<script lang="ts">
    import Menu from "../Menu/Menu.svelte";
    import MenuItem from "./MenuItem.svelte";
</script>

<Menu label="Edit">
    <MenuItem>Undo</MenuItem>
    <MenuItem aria-disabled="true">Redo</MenuItem>
    <MenuItem>Cut</MenuItem>
</Menu>
```

### Submenu trigger

```svelte
<script lang="ts">
    import Menu from "../Menu/Menu.svelte";
    import MenuItem from "./MenuItem.svelte";
    let submenuOpen = $state(false);
</script>

<Menu label="File">
    <MenuItem
        aria-haspopup="true"
        aria-expanded={submenuOpen}
        onclick={() => (submenuOpen = !submenuOpen)}
    >
        Recent Files
    </MenuItem>
</Menu>
```

### Menu item with rich content

```svelte
<script lang="ts">
    import Menu from "../Menu/Menu.svelte";
    import MenuItem from "./MenuItem.svelte";
</script>

<Menu label="Edit">
    <MenuItem>
        <span>Copy</span>
        <kbd>Cmd+C</kbd>
    </MenuItem>
    <MenuItem>
        <span>Paste</span>
        <kbd>Cmd+V</kbd>
    </MenuItem>
</Menu>
```

## Accessibility

- `role="menuitem"` identifies the item within a menu.
- `tabindex="-1"` enables the parent `Menu` to manage focus.
- Consumers should support Enter/Space activation via `onkeydown`.
- `aria-disabled="true"` marks an item unavailable without removing it from the menu.
- `aria-haspopup` / `aria-expanded` describe submenu relationships.
- Must be placed within a container with `role="menu"` or `role="menubar"`.
- Compliant with WAI-ARIA 1.2 Menu Pattern and WCAG 2.2 AAA with consumer-provided focus indicators.

## Related components

- `Menu` — the parent container that manages roving focus and arrow-key navigation.
- `DropdownMenu` — a menu anchored below a trigger button.
- `ContextMenu` / `ContextMenuItem` — right-click menu.
- `MenuBar` / `MenuBarButton` — horizontal menu bar.
- `Listbox` — selectable-option list (uses `role="option"`).
- `NavigationMenu` — semantic `<nav>` for site navigation.

---

Lily™ and Lily Design System™ are trademarks.
