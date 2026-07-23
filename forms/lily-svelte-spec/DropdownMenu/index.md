# DropdownMenu

A menu-button component that toggles a list of actions below a trigger. Implements the WAI-ARIA menu-button pattern with arrow key navigation and Escape-to-close.

## What it is

`DropdownMenu` pairs a `<button aria-haspopup="true" aria-expanded>` trigger with a conditionally rendered `<div role="menu">` container. On open, focus moves automatically to the first `[role="menuitem"]` element. Arrow, Home, End, and Escape keys manage navigation and dismissal.

## What it does

- Renders a trigger button labelled by `label` with `aria-haspopup`/`aria-expanded`.
- Conditionally renders a `<div role="menu">` with consumer-provided menu items.
- Auto-focuses the first `[role="menuitem"]` when the menu opens.
- Arrow Down/Up cycle through items (wrapping); Home/End jump to ends; Escape closes.
- Menu items are discovered dynamically via `querySelectorAll("[role='menuitem']")`.

## When to use it

- Row actions, overflow menus, settings menus.
- Context-sensitive option lists triggered by a visible button.
- Any pattern where a small list of actions lives behind a dropdown button.

## When not to use it

- For right-click or long-press menus. Use `ContextMenu` instead.
- For full-text command search. Use `Command`.
- For a list of selectable options that set a value. Use `Select`, `SelectWithExtras`, or `Listbox`.

## How to use it

Provide a `label` and children with `role="menuitem"` and `tabindex="-1"`.

```svelte
<script lang="ts">
    import DropdownMenu from "./DropdownMenu.svelte";
    let open = $state(false);
</script>

<DropdownMenu label="Options" bind:open>
    <li role="menuitem" tabindex="-1">Edit</li>
    <li role="menuitem" tabindex="-1">Duplicate</li>
    <li role="menuitem" tabindex="-1">Delete</li>
</DropdownMenu>
```

## Props

| Prop       | Type       | Default | Description                                       |
| ---------- | ---------- | ------- | ------------------------------------------------- |
| `class`    | `string`   | `""`    | CSS class appended to the base class.            |
| `label`    | `string`   | required| Accessible name and visible text for the trigger. |
| `open`     | `boolean`  | `false` | Whether the menu is open. Bindable.               |
| `children` | `Snippet`  | required| Menu items, each with `role="menuitem"`.          |
| `...rest`  | `unknown`  | —       | Additional HTML attributes on the wrapper `<div>`.|

## Usage

### 1. Basic dropdown

```svelte
<DropdownMenu label="Options" bind:open>
    <li role="menuitem" tabindex="-1">Edit</li>
    <li role="menuitem" tabindex="-1">Duplicate</li>
    <li role="menuitem" tabindex="-1">Delete</li>
</DropdownMenu>
```

### 2. With click handlers

```svelte
<DropdownMenu label="Actions" bind:open={menuOpen}>
    <li role="menuitem" tabindex="-1" onclick={() => handle("edit")}>Edit</li>
    <li role="menuitem" tabindex="-1" onclick={() => handle("delete")}>Delete</li>
</DropdownMenu>
```

### 3. Controlled from outside

```svelte
<button type="button" onclick={() => open = !open}>Toggle</button>
<DropdownMenu label="More" bind:open>
    <li role="menuitem" tabindex="-1">Export</li>
</DropdownMenu>
```

### 4. Row-scoped menu

```svelte
{#each rows as row}
    <DropdownMenu label={`Actions for ${row.name}`}>
        <li role="menuitem" tabindex="-1" onclick={() => edit(row)}>Edit</li>
        <li role="menuitem" tabindex="-1" onclick={() => remove(row)}>Remove</li>
    </DropdownMenu>
{/each}
```

### 5. With many items and keyboard use

```svelte
<DropdownMenu label="View">
    <li role="menuitem" tabindex="-1">Compact</li>
    <li role="menuitem" tabindex="-1">Comfortable</li>
    <li role="menuitem" tabindex="-1">Spacious</li>
</DropdownMenu>
<!-- ArrowDown/Up cycle | Home/End jump | Escape closes -->
```

## Accessibility

- Implements the WAI-ARIA Menu Button pattern.
- `aria-haspopup`/`aria-expanded` on trigger; `role="menu"` on container.
- Each child must set `role="menuitem"` and `tabindex="-1"` so arrow navigation works.
- Escape returns focus flow to the trigger (consumer should ensure focus is restored).

## Related components

- `Menu`, `MenuItem` — generic menu primitives.
- `ContextMenu`, `ContextMenuItem` — right-click/long-press menus.
- `MenuBar`, `MenuBarButton` — horizontal application menu bars.
- `Select`, `Combobox`, `Listbox` — selection widgets.

---

Lily™ and Lily Design System™ are trademarks.
