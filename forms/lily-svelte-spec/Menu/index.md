# Menu

Menu is a headless Svelte 5 container using the WAI-ARIA `menu` role with full vertical keyboard navigation. It renders a `<div role="menu">` and moves focus between child `role="menuitem"` elements via ArrowDown, ArrowUp, Home, and End. Menus present a list of discrete actions or commands — context menus, action menus triggered by buttons, dropdown menus, and so on.

## What it is

An accessible container for vertical menu navigation. It binds an internal `menuRef` and listens for keydown events to roaming-focus between children that carry `role="menuitem"`. Consumers normally nest `MenuItem` components, but any element carrying `role="menuitem"` + `tabindex="-1"` works.

## What it does

- Renders a `<div>` with `class="menu"` plus any consumer-provided CSS class.
- Applies `role="menu"` and `aria-label` from the required `label` prop.
- Binds `menuRef` to the DOM element to enumerate items via `querySelectorAll("[role='menuitem']")`.
- Handles these keys (wrapping at boundaries):
  - `ArrowDown` — focus the next item, wrapping to the first.
  - `ArrowUp` — focus the previous item, wrapping to the last.
  - `Home` — focus the first item.
  - `End` — focus the last item.
- Spreads `...restProps` onto the `<div>`.

## When to use it

- Action menus triggered by a button (e.g., "More actions").
- Context menus on right-click or long-press.
- Dropdown menus with a list of actions.
- Any vertical list of discrete actions or commands.

## When not to use it

- Do not use for selectable options — use `Listbox`.
- Do not use for navigation — use `NavigationMenu`, `TreeNav`, or `BreadcrumbNav`.
- Do not use for a horizontal menu bar — use `MenuBar`.
- Do not use for native selects — use `Select`.

## How to use it

Render `Menu` with a descriptive `label` and compose with `MenuItem` children (or any element with `role="menuitem"` and `tabindex="-1"`). Wire click handlers on each item.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `menu` class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `children` (Snippet, required) — menu-item elements (`role="menuitem"`, `tabindex="-1"`).
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>`.

## Usage

### Menu composed with MenuItem + arrow-key navigation

```svelte
<script lang="ts">
    import Menu from "./Menu.svelte";
    import MenuItem from "../MenuItem/MenuItem.svelte";
</script>

<Menu label="Actions">
    <MenuItem onclick={() => console.log("Cut")}>Cut</MenuItem>
    <MenuItem onclick={() => console.log("Copy")}>Copy</MenuItem>
    <MenuItem onclick={() => console.log("Paste")}>Paste</MenuItem>
    <MenuItem onclick={() => console.log("Delete")}>Delete</MenuItem>
</Menu>
```

ArrowDown/ArrowUp move focus between items (wrapping). Home/End jump to first/last.

### Dynamic menu from state

```svelte
<script lang="ts">
    import Menu from "./Menu.svelte";
    import MenuItem from "../MenuItem/MenuItem.svelte";

    let actions = [
        { id: "new", label: "New File" },
        { id: "open", label: "Open" },
        { id: "save", label: "Save" },
    ];
    function handle(id: string) {
        console.log(id);
    }
</script>

<Menu label="File actions">
    {#each actions as action}
        <MenuItem onclick={() => handle(action.id)}>{action.label}</MenuItem>
    {/each}
</Menu>
```

### Menu with a disabled item

```svelte
<script lang="ts">
    import Menu from "./Menu.svelte";
    import MenuItem from "../MenuItem/MenuItem.svelte";
</script>

<Menu label="Edit">
    <MenuItem>Undo</MenuItem>
    <MenuItem aria-disabled="true">Redo</MenuItem>
    <MenuItem>Cut</MenuItem>
</Menu>
```

### Menu used as a context menu

```svelte
<script lang="ts">
    import Menu from "./Menu.svelte";
    import MenuItem from "../MenuItem/MenuItem.svelte";
    let open = $state(false);

    function onContext(e: MouseEvent) {
        e.preventDefault();
        open = true;
    }
</script>

<div oncontextmenu={onContext}>Right-click me</div>

{#if open}
    <Menu label="Context menu">
        <MenuItem onclick={() => (open = false)}>Inspect</MenuItem>
        <MenuItem onclick={() => (open = false)}>Copy link</MenuItem>
    </Menu>
{/if}
```

### Menu triggered by a button with Enter/Space activation

```svelte
<script lang="ts">
    import Menu from "./Menu.svelte";
    import MenuItem from "../MenuItem/MenuItem.svelte";
    let open = $state(false);

    function activate(label: string) {
        alert(label);
        open = false;
    }
</script>

<button
    type="button"
    aria-haspopup="menu"
    aria-expanded={open}
    onclick={() => (open = !open)}
>
    More
</button>

{#if open}
    <Menu label="More actions">
        <MenuItem
            onclick={() => activate("Rename")}
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    activate("Rename");
                }
            }}
        >
            Rename
        </MenuItem>
        <MenuItem onclick={() => activate("Move")}>Move</MenuItem>
    </Menu>
{/if}
```

## Accessibility

- `role="menu"` identifies the container as a menu widget for actions.
- `aria-label` provides the accessible name.
- Child items must use `role="menuitem"` and `tabindex="-1"` (`MenuItem` handles this automatically).
- Keyboard: ArrowDown/ArrowUp/Home/End (wrapping supported).
- Consumer is responsible for handling Enter/Space on menu items to activate actions.
- Compliant with WAI-ARIA 1.2 Menu Pattern and WCAG 2.2 AAA when focus indicators are provided.

## Related components

- `MenuItem` — the individual menu-item element designed to be nested inside `Menu`.
- `MenuBar` / `MenuBarButton` — horizontal application-style menu bar.
- `DropdownMenu` — a menu that opens below a trigger button.
- `ContextMenu` / `ContextMenuItem` — right-click / long-press menus.
- `Listbox` — a list of selectable options.
- `NavigationMenu` — a semantic `<nav>` for site-wide navigation.

---

Lily™ and Lily Design System™ are trademarks.
