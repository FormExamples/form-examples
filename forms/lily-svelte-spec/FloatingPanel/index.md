# FloatingPanel

A floating panel container that overlays page content, typically used for tooltips, popovers, dropdown menus, or contextual UI. The panel renders conditionally based on an `open` prop and is fully removed from the DOM when closed.

## What it is

A Svelte 5 component that conditionally renders a `<div>` with `role="region"` and an `aria-label`. It does not apply positioning styles; consumers supply all CSS for placement relative to a trigger element.

## What it does

- When `open` is truthy, renders `<div class="floating-panel ..." role="region" aria-label={label}>` containing the `children` snippet.
- When `open` is falsy, renders nothing at all (element removed from the DOM via `{#if open}`).
- Spreads any additional HTML attributes onto the panel `<div>`.

## When to use it

- Building custom popovers, dropdown menus, or tooltip-style surfaces with consumer-controlled positioning.
- Floating UI overlays where presence in the DOM should follow visibility state (to avoid tab-order leaks).
- Contextual help panels, filter panels, or option sheets anchored to a trigger.

## When not to use it

- For modal dialogues that trap focus and require user acknowledgement. Use `Dialog` or `AlertDialog`.
- For a hover-triggered tooltip with built-in `role="tooltip"` semantics. Use `HoverCard` or `Tooltip`.
- For a side panel that slides in from a screen edge. Use `Drawer`, `Sheet`, or `SlideOutDrawer`.
- For a dropdown list with filtering. Use `Combobox`.

## How to use it

Manage an `open` boolean in consumer state. Render `FloatingPanel` next to its trigger and toggle `open` from the trigger's events. The component itself does not manage focus, Escape-to-close, or outside-click.

## Props

- `class` (string, optional) - CSS class appended after the base `floating-panel` class.
- `open` (boolean, default `false`) - Whether the panel is rendered. When `false`, the element is not in the DOM.
- `label` (string, required) - Accessible name applied via `aria-label`.
- `children` (Snippet, required) - Panel content.
- `...restProps` - Additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
    import FloatingPanel from "./FloatingPanel.svelte";
    let open = $state(false);
</script>

<button onclick={() => (open = !open)}>Toggle</button>
<FloatingPanel {open} label="Options">
    <p>Some contextual options.</p>
</FloatingPanel>
```

```svelte
<script lang="ts">
    import FloatingPanel from "./FloatingPanel.svelte";
    let filtersVisible = $state(false);
</script>

<button onclick={() => (filtersVisible = !filtersVisible)}>Filters</button>
<FloatingPanel open={filtersVisible} label="Filters">
    <form>
        <label>Category <input name="category" /></label>
    </form>
</FloatingPanel>
```

```svelte
<script lang="ts">
    import FloatingPanel from "./FloatingPanel.svelte";
    let open = $state(false);
    function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") open = false;
    }
</script>

<svelte:window on:keydown={onKey} />
<button onclick={() => (open = true)}>Open panel</button>
<FloatingPanel {open} label="Details">
    <p>Press Escape to close.</p>
    <button onclick={() => (open = false)}>Close</button>
</FloatingPanel>
```

```svelte
<script lang="ts">
    import FloatingPanel from "./FloatingPanel.svelte";
    let open = $state(true);
</script>

<FloatingPanel
    {open}
    label="Contextual help"
    class="help-panel"
    data-testid="help-panel"
>
    <h3>Help</h3>
    <p>More information about this field.</p>
</FloatingPanel>
```

```svelte
<script lang="ts">
    import FloatingPanel from "./FloatingPanel.svelte";
    let open = $state(false);
    let anchor: HTMLButtonElement;
</script>

<button bind:this={anchor} onclick={() => (open = !open)}>Menu</button>
<FloatingPanel {open} label="Actions" aria-labelledby="menu-heading">
    <h2 id="menu-heading">Actions</h2>
    <ul>
        <li><button onclick={() => (open = false)}>Edit</button></li>
        <li><button onclick={() => (open = false)}>Delete</button></li>
    </ul>
</FloatingPanel>
```

## Accessibility

- `role="region"` marks the panel as a landmark region.
- `aria-label` names that region.
- Consumers are responsible for focus management (moving focus in/out, Escape-to-close, outside-click).
- When `open` is `false` the panel is removed from the DOM, so it is not reachable by Tab or screen reader navigation.

## Related components

- `HoverCard` - hover/focus-driven tooltip with `role="tooltip"`.
- `Tooltip` - short descriptive text popup.
- `Popover` - floating content anchored to a trigger.
- `Popup` - temporary overlay above page content.
- `Dialog` / `AlertDialog` - modal dialogs.
- `Drawer` / `Sheet` / `SlideOutDrawer` - edge-anchored panels.
