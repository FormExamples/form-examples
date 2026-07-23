# MenuBar

MenuBar is a headless Svelte 5 horizontal menu bar using the WAI-ARIA `menubar` role. It renders a `<div role="menubar">` and manages horizontal focus movement between top-level menu items via ArrowLeft/ArrowRight, mimicking desktop application menu bars (e.g., File, Edit, View).

## What it is

An accessible container for horizontal menu navigation. It listens for keydown events and roving-focuses child elements carrying `role="menuitem"` (typically `MenuBarButton`). Each top-level item may open a submenu or trigger an action.

## What it does

- Renders a `<div>` with `class="menu-bar"` plus any consumer-provided CSS class.
- Applies `role="menubar"` and `aria-label` from the required `label` prop.
- Binds `barRef` to the DOM element to enumerate items via `querySelectorAll("[role='menuitem']")`.
- Handles these keys (wrapping at boundaries):
  - `ArrowRight` — focus next item, wrapping to the first.
  - `ArrowLeft` — focus previous item, wrapping to the last.
  - `Home` — focus the first item.
  - `End` — focus the last item.
- Spreads `...restProps` onto the `<div>`.

## When to use it

- Application-style horizontal menu bars (File, Edit, View, Window, Help).
- Top-level command surfaces in a desktop-style web application.
- A primary toolbar where each button may open a submenu.

## When not to use it

- Do not use for a vertical action menu — use `Menu`.
- Do not use for primary navigation to other pages — use `NavigationMenu`.
- Do not use for a simple toolbar of icon actions — use `ToolBar` / `ToolBarButton`.
- Do not use for tabbed panels — use `TabBar` / `TabBarButton`.

## How to use it

Compose `MenuBar` with `MenuBarButton` children, one per top-level menu entry. Wire up click/keydown handlers that open submenus (typically `Menu`) when appropriate.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `menu-bar` class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `children` (Snippet, required) — `MenuBarButton` elements.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic application menu bar composition

```svelte
<script lang="ts">
    import MenuBar from "./MenuBar.svelte";
    import MenuBarButton from "../MenuBarButton/MenuBarButton.svelte";
</script>

<MenuBar label="Main menu">
    <MenuBarButton>File</MenuBarButton>
    <MenuBarButton>Edit</MenuBarButton>
    <MenuBarButton>View</MenuBarButton>
    <MenuBarButton>Window</MenuBarButton>
    <MenuBarButton>Help</MenuBarButton>
</MenuBar>
```

ArrowRight/ArrowLeft move focus horizontally between items. Home/End jump to first/last.

### Menu bar from state

```svelte
<script lang="ts">
    import MenuBar from "./MenuBar.svelte";
    import MenuBarButton from "../MenuBarButton/MenuBarButton.svelte";
    let items = ["File", "Edit", "View"];
    function open(item: string) {
        console.log("open", item);
    }
</script>

<MenuBar label="Application menu">
    {#each items as item}
        <MenuBarButton onclick={() => open(item)}>{item}</MenuBarButton>
    {/each}
</MenuBar>
```

### Menu bar with each button triggering a Menu

```svelte
<script lang="ts">
    import MenuBar from "./MenuBar.svelte";
    import MenuBarButton from "../MenuBarButton/MenuBarButton.svelte";
    import Menu from "../Menu/Menu.svelte";
    import MenuItem from "../MenuItem/MenuItem.svelte";

    let openMenu = $state<string | null>(null);
</script>

<MenuBar label="Main">
    <MenuBarButton
        aria-haspopup="menu"
        aria-expanded={openMenu === "file"}
        onclick={() => (openMenu = openMenu === "file" ? null : "file")}
    >
        File
    </MenuBarButton>
    <MenuBarButton
        aria-haspopup="menu"
        aria-expanded={openMenu === "edit"}
        onclick={() => (openMenu = openMenu === "edit" ? null : "edit")}
    >
        Edit
    </MenuBarButton>
</MenuBar>

{#if openMenu === "file"}
    <Menu label="File">
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuItem>Save</MenuItem>
    </Menu>
{:else if openMenu === "edit"}
    <Menu label="Edit">
        <MenuItem>Undo</MenuItem>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
    </Menu>
{/if}
```

### Menu bar with a disabled button

```svelte
<script lang="ts">
    import MenuBar from "./MenuBar.svelte";
    import MenuBarButton from "../MenuBarButton/MenuBarButton.svelte";
</script>

<MenuBar label="Main">
    <MenuBarButton>File</MenuBarButton>
    <MenuBarButton disabled>Edit</MenuBarButton>
    <MenuBarButton>View</MenuBarButton>
</MenuBar>
```

### Menu bar with a consumer CSS class

```svelte
<script lang="ts">
    import MenuBar from "./MenuBar.svelte";
    import MenuBarButton from "../MenuBarButton/MenuBarButton.svelte";
</script>

<MenuBar class="app-menubar" label="Application">
    <MenuBarButton>File</MenuBarButton>
    <MenuBarButton>Edit</MenuBarButton>
</MenuBar>

<style>
    :global(.app-menubar) {
        display: flex;
        gap: 0.25rem;
        border-bottom: 1px solid #e5e7eb;
    }
</style>
```

## Accessibility

- `role="menubar"` identifies the container as a horizontal menu bar widget.
- `aria-label` provides the accessible name.
- Child `MenuBarButton` elements carry `role="menuitem"` + `tabindex="-1"`.
- Keyboard: ArrowLeft/ArrowRight/Home/End (wrapping supported).
- Consumers are responsible for handling Enter/Space/Down to open submenus.
- Compliant with WAI-ARIA 1.2 Menu Bar Pattern and WCAG 2.2 AAA when focus indicators are provided.

## Related components

- `MenuBarButton` — the individual entry for a `MenuBar`.
- `Menu` / `MenuItem` — vertical action menu (often used as a submenu below a MenuBarButton).
- `DropdownMenu` — a menu anchored below a trigger.
- `ContextMenu` — right-click menu.
- `TabBar` / `TabBarButton` — horizontal tabs for switching content panels.
- `ToolBar` / `ToolBarButton` — horizontal toolbar for actions.

---

Lily™ and Lily Design System™ are trademarks.
