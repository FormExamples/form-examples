# ContextMenuItem

A headless menu item for use inside a `ContextMenu`. Renders a `<div role="menuitem" tabindex="-1">`. The `tabindex="-1"` supports the roving-focus pattern managed by the parent `ContextMenu`.

## What it is

ContextMenuItem is a Svelte 5 component that emits `<div role="menuitem" tabindex="-1">` with the provided children. It does not manage its own focus or state; the parent menu focuses the first item on open and navigates via arrow keys.

## What it does

- Renders a `role="menuitem"` element with `tabindex="-1"`.
- Accepts children for the label, shortcut hint, etc.
- Spreads `restProps` onto the `<div>`.

## When to use it

- As a direct child of `ContextMenu`.
- For disabled items, pass `aria-disabled="true"` in restProps.
- For keyboard-shortcut hints, pass `aria-keyshortcuts="..."`.

## When not to use it

- Outside a `role="menu"` container — semantics will be wrong.
- For a menubar item — use `MenuBarButton`.
- For a navigation link — use `BreadcrumbLink` or similar.

## How to use it

Place inside `ContextMenu`. Add click handlers via `restProps` (`onclick`) to implement the action. Use `aria-disabled` for disabled state.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `children` | `Snippet` | required | Menu item content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<div>`. |

## Usage

```svelte
<script lang="ts">
    import ContextMenu from "../ContextMenu/ContextMenu.svelte";
    import ContextMenuItem from "./ContextMenuItem.svelte";

    let open = $state(false);
</script>

<ContextMenu label="Actions" bind:open>
    <ContextMenuItem>Cut</ContextMenuItem>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
</ContextMenu>
```

```svelte
<script lang="ts">
    import ContextMenu from "../ContextMenu/ContextMenu.svelte";
    import ContextMenuItem from "./ContextMenuItem.svelte";

    let open = $state(false);
</script>

<ContextMenu label="Edit" bind:open>
    <ContextMenuItem onclick={() => console.log("Undo")}>Undo</ContextMenuItem>
    <ContextMenuItem onclick={() => console.log("Redo")}>Redo</ContextMenuItem>
    <ContextMenuItem aria-disabled="true">Delete</ContextMenuItem>
</ContextMenu>
```

```svelte
<script lang="ts">
    import ContextMenu from "../ContextMenu/ContextMenu.svelte";
    import ContextMenuItem from "./ContextMenuItem.svelte";

    let open = $state(false);
</script>

<ContextMenu label="Clipboard" bind:open>
    <ContextMenuItem aria-keyshortcuts="Control+X">Cut</ContextMenuItem>
    <ContextMenuItem aria-keyshortcuts="Control+C">Copy</ContextMenuItem>
    <ContextMenuItem aria-keyshortcuts="Control+V">Paste</ContextMenuItem>
</ContextMenu>
```

## Accessibility

- `role="menuitem"` signals membership in a menu.
- `tabindex="-1"` removes the item from the normal tab order so the parent menu can manage focus with arrow keys.
- Consumers should attach Enter/Space handlers if they need click-equivalent activation.

## Related components

- `ContextMenu` — parent container.
- `MenuItem` — menu item for `Menu`.
- `DropdownMenu` — menu under a trigger button.

---

Lily™ and Lily Design System™ are trademarks.
