# TaskList

An ordered list of task items rendered as a semantic `<ol role="list">` with an accessible label, designed to be populated with `TaskListItem` components for displaying to-dos, action items, or sequences.

## What it is

`TaskList` is a headless Svelte 5 container component that renders an `<ol>` element with an explicit `role="list"` and an `aria-label`. It is the parent in the `TaskList` → `TaskListItem` composition pattern used to display a collection of tasks.

## What it does

- Renders an `<ol>` with base class `task-list` and the supplied `aria-label`.
- Uses `role="list"` explicitly so screen readers continue to announce list semantics even when consumer CSS removes default list styling (which removes implicit list semantics in some browsers).
- Accepts a required `children` snippet. Children should be `<li>` elements or `TaskListItem` components.
- Spreads additional HTML attributes onto the `<ol>`.

## When to use it

- To present a series of tasks, to-dos, or action items that the user should complete.
- Onboarding checklists, setup wizards, or progress tracking sequences.
- Project management or workflow views where each row represents one task.

## When not to use it

- Don't use it for unordered content where sequence is irrelevant — use a plain `<ul>` or `DoList`/`DontList` for semantic guideline lists.
- Don't use it for navigation — use `TreeNav`, `BreadcrumbNav`, or `ContentsNav`.
- Don't use it as a table — use `DataTable` when you need rows and columns.
- Don't use it for chat messages — use `ChatList`/`ChatListItem`.

## How to use it

Import `TaskList` and place `TaskListItem` children (or raw `<li>` elements) inside. Provide an `aria-label` via the `label` prop describing what the list represents.

## Props

- `class` — string, optional. Extra CSS class appended to `task-list`.
- `label` — string, required. Accessible label for the list via `aria-label`.
- `children` — Snippet, required. Task items, usually `TaskListItem` instances.
- `...restProps` — any additional HTML attributes spread onto the `<ol>`.

## Usage

```svelte
<script lang="ts">
  import TaskList from "./TaskList.svelte";
  import TaskListItem from "../TaskListItem/TaskListItem.svelte";
</script>

<TaskList label="Today's tasks">
  <TaskListItem label="Review pull requests" />
  <TaskListItem label="Update documentation" />
  <TaskListItem label="Deploy to staging" />
</TaskList>
```

```svelte
<script lang="ts">
  import TaskList from "./TaskList.svelte";
  import TaskListItem from "../TaskListItem/TaskListItem.svelte";

  let a = $state(false);
  let b = $state(true);
</script>

<TaskList label="Onboarding checklist">
  <TaskListItem label="Create account" bind:checked={a} />
  <TaskListItem label="Complete profile" bind:checked={b} />
</TaskList>
```

```svelte
<script lang="ts">
  import TaskList from "./TaskList.svelte";
</script>

<TaskList label="Raw li example">
  <li><label><input type="checkbox" /> Free-form item</label></li>
</TaskList>
```

```svelte
<script lang="ts">
  import TaskList from "./TaskList.svelte";
  import TaskListItem from "../TaskListItem/TaskListItem.svelte";

  const tasks = $state([
    { id: 1, label: "Buy groceries", checked: false },
    { id: 2, label: "Wash car", checked: true },
  ]);
</script>

<TaskList label="Weekend chores">
  {#each tasks as task (task.id)}
    <TaskListItem label={task.label} bind:checked={task.checked} />
  {/each}
</TaskList>
```

## Accessibility

- Explicit `role="list"` guarantees list semantics are announced regardless of CSS reset rules.
- `aria-label` provides the list its accessible name; always supply a meaningful label.
- Tab order moves through focusable children (checkboxes, buttons, links) inside items.
- Screen readers announce position and total ("2 of 4") when items are present.

## Related components

- `TaskListItem` — the item child component designed to pair with this list.
- `CheckList` / `CheckListItem` — similar pattern but scoped to checked/unchecked checklists.
- `TourList` / `TourListItem` — guided walkthrough sequences.
- `TimelineList` / `TimelineListItem` — chronological event ordering.

---

Lily™ and Lily Design System™ are trademarks.
