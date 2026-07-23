# SlideOutDrawer

A headless modal dialog that slides out from the side of the screen. Conditionally rendered and dismissed with Escape.

## What it is

A Svelte 5 headless component that, when `open` is `true`, renders `<div class="slide-out-drawer ...">` with `role="dialog"`, `aria-label`, `aria-modal="true"`, and `tabindex="-1"`. When `open` is `false`, the component renders nothing.

## What it does

- Conditionally mounts based on the `open` binding.
- Declares modal dialog semantics (`role="dialog"`, `aria-modal="true"`).
- Attaches a keydown handler that closes the drawer on Escape (setting `open = false`).
- Renders `children` inside.
- Spreads `...restProps` onto the `<div>`.

Slide direction, overlay backdrop, focus trap, and animations are implementation details left to the consumer.

## When to use it

- Mobile navigation drawers triggered by a hamburger menu.
- Secondary settings panels shown over the main UI.
- Filter or sort overlays in mobile-first experiences.

## When not to use it

- Non-modal panels - use `Popover`, `FloatingPanel`, or `Sheet` depending on pattern.
- Persistent sidebars - use `Sidebar`.
- Dialogs with forced acknowledgment - use `AlertDialog`.

## How to use it

1. Import the component.
2. Provide a translated `label`.
3. Bind `open` via `bind:open`.
4. Implement the trigger (button) that sets `open = true`.
5. Add focus trapping and slide-in animation via CSS/consumer code.

## Props

- `class` (string, optional, default `""`) - merged with the base `slide-out-drawer` class.
- `label` (string, required) - accessible name via `aria-label`.
- `open` (boolean, optional, default `false`, bindable).
- `children` (Snippet, required) - drawer content.
- `...restProps` - spread onto the `<div>`.

## Usage

Navigation drawer:

```svelte
<script lang="ts">
    import SlideOutDrawer from "./SlideOutDrawer.svelte";
    let open = $state(false);
</script>

<button onclick={() => (open = true)}>Menu</button>
<SlideOutDrawer label="Navigation menu" bind:open>
    <nav>
        <ul><li><a href="/">Home</a></li></ul>
    </nav>
    <button onclick={() => (open = false)}>Close</button>
</SlideOutDrawer>
```

Settings panel:

```svelte
<script lang="ts">
    import SlideOutDrawer from "./SlideOutDrawer.svelte";
    let settingsOpen = $state(false);
</script>

<button onclick={() => (settingsOpen = true)}>Settings</button>
<SlideOutDrawer label="Settings panel" bind:open={settingsOpen}>
    <h2>Settings</h2>
    <label><input type="checkbox" /> Enable notifications</label>
</SlideOutDrawer>
```

Keyboard-only dismissal reminder (Escape is built in):

```svelte
<script lang="ts">
    import SlideOutDrawer from "./SlideOutDrawer.svelte";
    let open = $state(true);
</script>

<SlideOutDrawer label="Press Escape to close" bind:open>
    <p>This drawer closes when you press Escape.</p>
</SlideOutDrawer>
```

With CSS class for animation:

```svelte
<script lang="ts">
    import SlideOutDrawer from "./SlideOutDrawer.svelte";
    let open = $state(false);
</script>

<SlideOutDrawer label="Drawer" bind:open class="slide-right">
    <p>Content</p>
</SlideOutDrawer>
```

Inline close:

```svelte
<script lang="ts">
    import SlideOutDrawer from "./SlideOutDrawer.svelte";
    let open = $state(true);
</script>

<SlideOutDrawer label="Filters" bind:open>
    <button onclick={() => (open = false)}>Apply</button>
</SlideOutDrawer>
```

## Accessibility

- `role="dialog"` + `aria-modal="true"` + `aria-label` form a conformant modal dialog.
- `tabindex="-1"` makes the dialog container programmatically focusable.
- Escape is wired to close.
- The consumer must:
  - Move focus to the dialog on open.
  - Trap focus inside while open.
  - Restore focus to the trigger on close.

References:
- WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

## Related components

- `Sheet` - edge-aware side sheet variant (supports `side`).
- `Drawer` - simple edge panel.
- `Dialog`, `AlertDialog` - centered modal dialogs.
- `Sidebar` - persistent complementary region.

---

Lily™ and Lily Design System™ are trademarks.
