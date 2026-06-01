# TaskBar

A headless toolbar container for quick-access action buttons, with built-in horizontal arrow-key navigation.

## What it is

A Svelte 5 headless component that renders `<div class="task-bar ...">` with `role="toolbar"` and `aria-label`. It queries its descendants for focusable elements (`button`, `[role='button']`, `[tabindex]`) and cycles focus among them with Arrow / Home / End keys.

## What it does

- Declares itself as a toolbar landmark.
- Applies `aria-label`.
- Manages horizontal keyboard navigation:
  - ArrowRight -> next focusable descendant (wraps to first)
  - ArrowLeft -> previous (wraps to last)
  - Home -> first
  - End -> last
- Renders `children`. The companion button component `TaskBarButton` lives in a sibling batch of components (not documented here).
- Spreads `...restProps` onto the `<div>`.

## When to use it

- Top-of-page or pane-level action bars: New / Open / Save / Print, etc.
- Per-document editing tool bars.
- Any horizontal row of related action buttons that should be keyboard-navigable.

## When not to use it

- Tabs that switch content - use `TabBar`.
- Site navigation - use `NavigationMenu`, `Header`, or a custom `<nav>`.
- Menu triggers - use `MenuBar` + `MenuBarButton`.
- Radio-style segmented controls - use `SegmentGroup`.

## How to use it

1. Import the component.
2. Provide a translated `label`.
3. Render buttons or button-like elements inside `children`. The `TaskBarButton` component is a sibling; it is intended to be used here, but its documentation is produced in a separate batch.
4. Because the key handler queries `button, [role='button'], [tabindex]`, any standard button, custom role-button element, or focusable element will be part of the roving focus cycle.

## Props

- `class` (string, optional, default `""`) - merged with the base `task-bar` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - task buttons (typically `TaskBarButton` components).
- `...restProps` - spread onto the `<div>`.

## Usage

Plain buttons:

```svelte
<script lang="ts">
    import TaskBar from "./TaskBar.svelte";
</script>

<TaskBar label="Tasks">
    <button>New</button>
    <button>Open</button>
    <button>Save</button>
</TaskBar>
```

With `TaskBarButton` (companion component lives in a sibling directory):

```svelte
<script lang="ts">
    import TaskBar from "./TaskBar.svelte";
    import TaskBarButton from "../TaskBarButton/TaskBarButton.svelte";
</script>

<TaskBar label="Document actions">
    <TaskBarButton onclick={() => {}}>New</TaskBarButton>
    <TaskBarButton onclick={() => {}}>Open</TaskBarButton>
    <TaskBarButton onclick={() => {}}>Save</TaskBarButton>
</TaskBar>
```

Dynamic list of actions:

```svelte
<script lang="ts">
    import TaskBar from "./TaskBar.svelte";
    const actions = [
        { id: "new", label: "New" },
        { id: "open", label: "Open" },
        { id: "save", label: "Save" },
    ];
    function run(id: string) { console.log("action", id); }
</script>

<TaskBar label="Tasks">
    {#each actions as a}
        <button onclick={() => run(a.id)}>{a.label}</button>
    {/each}
</TaskBar>
```

With a disabled action:

```svelte
<script lang="ts">
    import TaskBar from "./TaskBar.svelte";
</script>

<TaskBar label="Editor tasks">
    <button>Cut</button>
    <button>Copy</button>
    <button disabled>Paste</button>
</TaskBar>
```

Mixed button types (the arrow handler finds all focusable elements):

```svelte
<script lang="ts">
    import TaskBar from "./TaskBar.svelte";
</script>

<TaskBar label="Mixed">
    <button>Run</button>
    <a href="/help" tabindex="0">Help</a>
    <div role="button" tabindex="0">Custom</div>
</TaskBar>
```

## Accessibility

- `role="toolbar"` + `aria-label` announces the bar as a toolbar landmark.
- Arrow / Home / End navigate between focusable descendants (wrapping).
- Consumers should ensure only one descendant has `tabindex="0"` at a time (roving tabindex) for WAI-ARIA conformance.

References:
- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

## Related components

- `TaskBarButton` - intended child (lives in a sibling directory and batch).
- `ToolBar`, `ToolBarButton` - related toolbar pattern.
- `MenuBar`, `MenuBarButton` - menu bar.
- `TabBar`, `TabBarButton` - tabs pattern.
