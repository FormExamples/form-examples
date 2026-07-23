# ToolBar

A headless toolbar container rendered as `<div role="toolbar">` with arrow-key roving focus (Left/Right, Home/End) that wraps around, designed to hold `ToolBarButton` children.

## What it is

`ToolBar` is a Svelte 5 component that provides the WAI-ARIA toolbar role plus built-in keyboard navigation. It implements a roving focus pattern: `ArrowRight`/`ArrowLeft` move between focusable items, `Home`/`End` jump to first/last, and navigation wraps at boundaries.

## What it does

- Renders `<div class="tool-bar {className}" role="toolbar" aria-label={label}>`.
- Tracks its DOM ref and queries focusable children — `button`, `[role="button"]`, `[tabindex]` — as toolbar items.
- On `ArrowRight` / `ArrowLeft` / `Home` / `End` keypresses, moves focus to the appropriate item (wrapping at the boundaries).
- Renders the `children` snippet as the toolbar items.
- Spreads additional HTML attributes onto the `<div>`.

## When to use it

- Text editor toolbars (bold, italic, underline, undo/redo).
- Photo / drawing editor control strips.
- Action toolbars in data views (filter, sort, export).
- Any toolbar where arrow-key navigation is expected.

## When not to use it

- Don't use it for persistent top navigation menus — use `NavigationMenu` or a `<nav>`.
- Don't use it for mutually exclusive mode selection — use `SegmentGroup`.
- Don't use it when only Tab navigation is needed — a plain `<div>` with `role="group"` is simpler.
- Don't use it when you need a menubar pattern — use `MenuBar`/`MenuBarButton`.

## How to use it

Import both `ToolBar` and `ToolBarButton`. Pass a translated `label` and render one `ToolBarButton` per action.

## Props

- `class` — string, optional. Extra CSS class appended to `tool-bar`.
- `label` — string, required. Accessible name via `aria-label`.
- `children` — Snippet, required. `ToolBarButton` elements (or other focusable items).
- `...restProps` — any additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
  import ToolBar from "./ToolBar.svelte";
  import ToolBarButton from "../ToolBarButton/ToolBarButton.svelte";
</script>

<ToolBar label="Editor tools">
  <ToolBarButton>Bold</ToolBarButton>
  <ToolBarButton>Italic</ToolBarButton>
  <ToolBarButton>Underline</ToolBarButton>
</ToolBar>
```

```svelte
<script lang="ts">
  import ToolBar from "./ToolBar.svelte";
  import ToolBarButton from "../ToolBarButton/ToolBarButton.svelte";

  const actions = ["Cut", "Copy", "Paste"];
  let last = $state("");
</script>

<ToolBar label="Clipboard actions">
  {#each actions as a}
    <ToolBarButton onclick={() => (last = a)}>{a}</ToolBarButton>
  {/each}
</ToolBar>
<p>Last: {last}</p>
```

```svelte
<script lang="ts">
  import ToolBar from "./ToolBar.svelte";
  import ToolBarButton from "../ToolBarButton/ToolBarButton.svelte";

  let undoable = $state(false);
  let redoable = $state(false);
</script>

<ToolBar label="History">
  <ToolBarButton disabled={!undoable}>Undo</ToolBarButton>
  <ToolBarButton disabled={!redoable}>Redo</ToolBarButton>
</ToolBar>
```

```svelte
<script lang="ts">
  import ToolBar from "./ToolBar.svelte";
  import ToolBarButton from "../ToolBarButton/ToolBarButton.svelte";
</script>

<ToolBar label="Outils d'édition">
  <ToolBarButton>Gras</ToolBarButton>
  <ToolBarButton>Italique</ToolBarButton>
  <ToolBarButton>Souligné</ToolBarButton>
</ToolBar>
```

## Accessibility

- `role="toolbar"` identifies the container as a toolbar widget.
- `aria-label` supplies the accessible name.
- Keyboard:
  - `ArrowRight` / `ArrowLeft` move focus with wrap-around.
  - `Home` / `End` jump to first/last focusable item.
  - `Tab` moves focus in or out of the toolbar as a whole.
- Consumers should ensure children are focusable (native `<button>` elements are ideal).

## Related components

- `ToolBarButton` — the standard child button.
- `TaskBar` / `TaskBarButton` — simpler action bar without roving focus.
- `MenuBar` / `MenuBarButton` — menubar pattern for menu triggers.
- `ToggleGroup` / `ToggleButton` — grouped toggle buttons without roving focus.

---

Lily™ and Lily Design System™ are trademarks.
