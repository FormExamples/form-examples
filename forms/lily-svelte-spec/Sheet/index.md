# Sheet

A headless modal overlay that slides in from one of the four viewport edges. Rendered conditionally via `{#if open}` and dismissed with Escape.

## What it is

A Svelte 5 headless component that, when `open` is `true`, renders a single `<div class="sheet ...">` with:

- `role="dialog"`
- `aria-label={label}`
- `aria-modal="true"`
- `tabindex="-1"`
- `data-side={side}` (for CSS targeting of the slide-in direction)

When `open` is `false`, nothing is rendered in the DOM.

## What it does

- Conditionally mounts the dialog based on the `open` binding.
- Declares modal dialog semantics.
- Exposes `data-side="left|right|top|bottom"` for CSS slide-in animations.
- Handles the Escape key to set `open = false` (value is `$bindable(false)`).

Focus trapping, backdrop click, and animation are left to the consumer.

## When to use it

- Mobile-style bottom action sheets.
- Right-side detail panels or filter drawers.
- Left-side navigation overlays.
- Top-edge banner-like modals.

## When not to use it

- Non-modal panels that should not block the underlying page - consider `Popover` or `FloatingPanel`.
- Persistent side navigation - use `Sidebar` or `SlideOutDrawer` (depending on pattern).
- Critical acknowledgment dialogs - use `AlertDialog`.
- Full-screen modal workflows - use `Dialog`.

## How to use it

1. Import the component.
2. Supply a translated `label` (required).
3. Bind `open` with `bind:open`.
4. Pick a `side` for the animation direction.
5. Implement the trigger button that toggles `open` to `true`.
6. Implement any focus-trap and CSS transitions yourself.

## Props

- `class` (string, optional, default `""`) - merged with the base `sheet` class.
- `label` (string, required) - accessible name via `aria-label`.
- `open` (boolean, optional, default `false`, bindable).
- `side` (`"left" | "right" | "top" | "bottom"`, optional, default `"right"`).
- `children` (Snippet, required) - sheet content.
- `...restProps` - spread onto the `<div>`.

## Usage

Right-side sheet toggled by a button:

```svelte
<script lang="ts">
    import Sheet from "./Sheet.svelte";
    let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open</button>
<Sheet label="Settings" bind:open side="right">
    <h2>Settings</h2>
    <button onclick={() => (open = false)}>Close</button>
</Sheet>
```

Left-side navigation:

```svelte
<script lang="ts">
    import Sheet from "./Sheet.svelte";
    let navOpen = $state(false);
</script>

<button onclick={() => (navOpen = true)}>Menu</button>
<Sheet label="Navigation" bind:open={navOpen} side="left">
    <nav><a href="/">Home</a></nav>
</Sheet>
```

Bottom action sheet:

```svelte
<script lang="ts">
    import Sheet from "./Sheet.svelte";
    let actionsOpen = $state(false);
</script>

<button onclick={() => (actionsOpen = true)}>Actions</button>
<Sheet label="Actions" bind:open={actionsOpen} side="bottom">
    <button>Share</button>
    <button>Delete</button>
    <button onclick={() => (actionsOpen = false)}>Close</button>
</Sheet>
```

Top notification-style sheet:

```svelte
<script lang="ts">
    import Sheet from "./Sheet.svelte";
    let notifOpen = $state(false);
</script>

<Sheet label="Notifications" bind:open={notifOpen} side="top">
    <ul><li>Message received</li></ul>
</Sheet>
```

Styling by side via CSS:

```svelte
<style>
    .sheet[data-side="right"] { right: 0; animation: slideIn-right .2s; }
    .sheet[data-side="left"] { left: 0; animation: slideIn-left .2s; }
</style>
```

## Accessibility

- `role="dialog"` + `aria-modal="true"` + `aria-label` form a conformant modal dialog.
- Escape dismisses the sheet (built in).
- `tabindex="-1"` lets consumers move focus to the dialog container programmatically.
- Consumers must implement a focus trap and restore focus to the trigger on close.
- Underlying page should be made inert while the sheet is open.

References:
- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

## Related components

- `Dialog`, `AlertDialog` - other modal dialog variants.
- `Drawer`, `SlideOutDrawer` - related side panels.
- `Popover`, `FloatingPanel` - non-modal overlays.
- `Sidebar` - persistent complementary landmark.
