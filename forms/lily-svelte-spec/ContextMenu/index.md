# ContextMenu

A headless context menu that appears on demand (typically right-click or long-press) and displays a list of actions. It manages keyboard navigation between items, auto-focuses the first item on open, and closes on Escape. The `open` prop is bindable.

## What it is

ContextMenu renders `<div role="menu" aria-label={label}>` conditionally (`{#if open}`) and wires up keyboard handling for ArrowUp/ArrowDown (wrapping), Home/End, and Escape (closes the menu). When the menu opens, an `$effect` moves focus to the first element with `role="menuitem"`.

Consumers trigger opening via their own `contextmenu` event handler and provide menu items as children.

## What it does

- Renders a `role="menu"` container when `open` is true.
- Focuses the first `[role="menuitem"]` on open.
- Navigates between menu items with arrow keys (wraps), Home/End.
- Closes on Escape (sets `open = false`).

## When to use it

- Right-click or long-press actions in editors, file managers, tables.
- Per-item contextual actions tied to a specific target element.

## When not to use it

- For a menu opened by clicking a dedicated button — use `DropdownMenu` or `Menu`.
- For an app menu bar — use `MenuBar` and `MenuBarButton`.
- For a fully static set of links — use a list or nav.

## How to use it

Control `open` from your `oncontextmenu` handler on the trigger element. Provide `ContextMenuItem` or other `role="menuitem"` elements as children.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | `aria-label`. |
| `open` | `boolean` | `false` (bindable) | Whether the menu is visible. |
| `children` | `Snippet` | required | Items with `role="menuitem"`. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the menu `<div>`. |

## Usage

```svelte
<script lang="ts">
    import ContextMenu from "./ContextMenu.svelte";
    import ContextMenuItem from "../ContextMenuItem/ContextMenuItem.svelte";

    let open = $state(false);

    function openMenu(event: MouseEvent) {
        event.preventDefault();
        open = true;
    }
</script>

<div oncontextmenu={openMenu}>Right-click here</div>

<ContextMenu label="Actions" bind:open>
    <ContextMenuItem>Cut</ContextMenuItem>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
</ContextMenu>
```

```svelte
<script lang="ts">
    import ContextMenu from "./ContextMenu.svelte";
    import ContextMenuItem from "../ContextMenuItem/ContextMenuItem.svelte";

    let open = $state(false);

    function onItemClick(name: string) {
        console.log("Chose:", name);
        open = false;
    }
</script>

<button type="button" onclick={() => (open = true)}>Open actions</button>

<ContextMenu label="File actions" bind:open>
    <ContextMenuItem onclick={() => onItemClick("Open")}>Open</ContextMenuItem>
    <ContextMenuItem onclick={() => onItemClick("Rename")}>Rename</ContextMenuItem>
    <ContextMenuItem onclick={() => onItemClick("Delete")}>Delete</ContextMenuItem>
</ContextMenu>
```

```svelte
<script lang="ts">
    import ContextMenu from "./ContextMenu.svelte";
    import ContextMenuItem from "../ContextMenuItem/ContextMenuItem.svelte";

    let open = $state(true);
</script>

<ContextMenu label="Simple menu" bind:open>
    <ContextMenuItem>New tab</ContextMenuItem>
    <ContextMenuItem>New window</ContextMenuItem>
    <ContextMenuItem aria-disabled="true">Reopen closed tab</ContextMenuItem>
</ContextMenu>
```

```svelte
<script lang="ts">
    import ContextMenu from "./ContextMenu.svelte";
    import ContextMenuItem from "../ContextMenuItem/ContextMenuItem.svelte";

    let open = $state(false);
    const items = ["Cut", "Copy", "Paste"];
</script>

<ContextMenu label="Text actions" bind:open>
    {#each items as name}
        <ContextMenuItem>{name}</ContextMenuItem>
    {/each}
</ContextMenu>
```

## Accessibility

- `role="menu"` with `aria-label` names the menu container.
- Keyboard: ArrowDown/ArrowUp move focus (wrapping), Home/End jump, Escape closes.
- Focus is placed on the first menu item when opened.
- Consumers should add `aria-disabled="true"` to disabled items.

## Related components

- `ContextMenuItem` — individual `menuitem`.
- `DropdownMenu` — menu opened below a trigger.
- `Menu`, `MenuItem` — general-purpose menu pattern.
