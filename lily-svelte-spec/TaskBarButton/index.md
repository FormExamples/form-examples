# TaskBarButton

A single button item inside a TaskBar that renders as a native `<button type="button">` element for proper keyboard and screen reader support, with optional `disabled` state.

## What it is

`TaskBarButton` is a headless Svelte 5 component that wraps a single native `<button type="button">`. It is designed to be placed inside a `TaskBar` container so the parent can manage layout and grouping while this component handles the individual button semantics, disabled state, and content injection.

## What it does

- Renders a `<button type="button">` with the `task-bar-button` base CSS class plus an optional consumer-supplied class.
- Forwards any extra HTML attributes onto the `<button>` via rest-props spreading (event handlers, `aria-*`, `id`, `data-*`, etc.).
- Respects the `disabled` boolean prop so the button is skipped in tab order and announced as disabled.
- Renders `children` content inside the button for full flexibility (text, icons, compound markup).

## When to use it

- Inside a `TaskBar` to represent individual task shortcuts such as "New file", "Save", "Delete", "Archive".
- Any place you need a toolbar-style action button that should not submit a surrounding form.
- When you want to compose icon + label content into a single actionable button.

## When not to use it

- Don't use it to submit forms. Use `ButtonInput type="submit"` or the `SubmitInput` component instead.
- Don't use it to toggle a two-state setting. Use `ToggleButton` (which uses `role="switch"`).
- Don't use it for navigation. Use an `<a>` element or a `*Link` component.
- Don't use it outside of a `TaskBar` when you need toolbar grouping semantics.

## How to use it

Import the component and place one or more `TaskBarButton` elements inside a `TaskBar`. Provide content through the default snippet. Wire `onclick` and other HTML attributes via rest-props.

## Props

- `class` — string, optional. Extra CSS class appended to the `task-bar-button` base class.
- `disabled` — boolean, default `false`. Whether the button is disabled.
- `children` — Snippet, required. Button content.
- `...restProps` — any additional HTML attributes spread onto the `<button>` (e.g. `onclick`, `id`, `aria-describedby`).

## Usage

```svelte
<script lang="ts">
  import TaskBarButton from "./TaskBarButton.svelte";
</script>

<TaskBarButton onclick={() => console.log("new")}>New</TaskBarButton>
```

```svelte
<script lang="ts">
  import TaskBarButton from "./TaskBarButton.svelte";
</script>

<TaskBarButton disabled>Delete</TaskBarButton>
```

```svelte
<script lang="ts">
  import TaskBar from "../TaskBar/TaskBar.svelte";
  import TaskBarButton from "./TaskBarButton.svelte";

  let saving = $state(false);
</script>

<TaskBar label="Document actions">
  <TaskBarButton onclick={() => (saving = true)} disabled={saving}>
    {saving ? "Saving…" : "Save"}
  </TaskBarButton>
  <TaskBarButton>Print</TaskBarButton>
  <TaskBarButton>Share</TaskBarButton>
</TaskBar>
```

```svelte
<script lang="ts">
  import TaskBarButton from "./TaskBarButton.svelte";

  let count = $state(0);
</script>

<TaskBarButton onclick={() => count++} aria-describedby="hint">
  Add item ({count})
</TaskBarButton>
<span id="hint">Adds one item to the list.</span>
```

## Accessibility

- Uses the implicit `button` role from the native `<button>` element; no explicit role needed.
- `type="button"` prevents accidental form submission when placed inside a form.
- The `disabled` attribute is announced by assistive technology and removes the button from the tab sequence.
- Consumers must provide a meaningful label via visible text content inside `children`, or pass `aria-label`/`aria-labelledby` through rest-props when the visible content is decorative.

## Related components

- `TaskBar` — the container that arranges `TaskBarButton` items.
- `ToolBar` / `ToolBarButton` — similar pattern with built-in roving focus for editor-style toolbars.
- `MenuBar` / `MenuBarButton` — menubar navigation pattern.
- `Button` — a generic button for standalone use outside of bars.
