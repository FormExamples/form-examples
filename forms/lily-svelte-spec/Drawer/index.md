# Drawer

A panel that slides in from an edge of the viewport. Rendered conditionally as `<div role="dialog" aria-modal="true">` with a `data-side` attribute for consumer positioning.

## What it is

`Drawer` is a headless dialog-style overlay that enters from a chosen screen edge (`left`, `right`, `top`, or `bottom`). It handles Escape-to-close and accessible labelling; positioning and animation are entirely up to consumer CSS, which can target `[data-side="…"]`.

## What it does

- Conditionally renders a `<div role="dialog" aria-modal="true">` when `open` is `true`.
- Applies `aria-label` for the accessible name.
- Exposes `data-side="left|right|top|bottom"` for CSS hooks.
- Closes on Escape by setting `open = false`.
- Removes the drawer entirely from the DOM when closed.

## When to use it

- Mobile-friendly navigation menus, filter panels, cart or inbox panels.
- Supplementary content that should slide in over the main view.
- Responsive sidebars that hide until summoned.

## When not to use it

- For centred, modal confirmations or forms. Use `Dialog` or `AlertDialog` instead.
- For always-visible side content. Use `Sidebar` instead.
- For toast-style transient messages. Use `Toast` or `Notification`.

## How to use it

Bind `open` to a state variable and choose a `side`.

```svelte
<script lang="ts">
    import Drawer from "./Drawer.svelte";
    let open = $state(false);
</script>

<button type="button" onclick={() => open = true}>Open menu</button>
<Drawer label="Navigation" bind:open side="left">
    <nav>…</nav>
</Drawer>
```

## Props

| Prop       | Type                                       | Default | Description                                |
| ---------- | ------------------------------------------ | ------- | ------------------------------------------ |
| `class`    | `string`                                   | `""`    | CSS class appended to the base class.     |
| `open`     | `boolean`                                  | `false` | Whether the drawer is visible. Bindable.   |
| `label`    | `string`                                   | required| Accessible name via `aria-label`.          |
| `side`     | `"left" \| "right" \| "top" \| "bottom"`   | `"left"`| Edge the drawer enters from.               |
| `children` | `Snippet`                                  | required| Drawer content.                            |
| `...rest`  | `unknown`                                  | —       | Additional HTML attributes on the `<div>`. |

## Usage

### 1. Left-side navigation drawer

```svelte
<Drawer label="Navigation" bind:open side="left">
    <nav aria-label="Main">…</nav>
</Drawer>
```

### 2. Right-side filter drawer

```svelte
<Drawer label="Filters" bind:open={showFilters} side="right">
    <form>…</form>
</Drawer>
```

### 3. Top banner-style drawer

```svelte
<Drawer label="Announcements" bind:open side="top">
    <p>Release 2.0 is now available.</p>
</Drawer>
```

### 4. Bottom-sheet drawer

```svelte
<Drawer label="Details" bind:open side="bottom">
    <article>…</article>
</Drawer>
```

### 5. Close on action

```svelte
<script lang="ts">
    import Drawer from "./Drawer.svelte";
    let open = $state(true);
</script>

<Drawer label="Cart" bind:open side="right">
    <ul>…</ul>
    <button type="button" onclick={() => open = false}>Close</button>
</Drawer>
```

## Accessibility

- `role="dialog"` with `aria-modal="true"` and `aria-label`.
- Escape closes the drawer.
- `tabindex="-1"` supports programmatic focus management. Consumers should move focus into the drawer on open and return it to the trigger on close.

## Related components

- `SlideOutDrawer` — alternative slide-out panel pattern.
- `Sheet` — overlay sheet from a screen edge.
- `Dialog` — centred modal dialog.
- `Sidebar` — persistent side navigation.
