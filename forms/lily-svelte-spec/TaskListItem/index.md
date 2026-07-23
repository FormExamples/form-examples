# TaskListItem

A single task entry with a checkbox and label, rendered as a semantic `<li>` containing a `<label>`-wrapped `<input type="checkbox">`, with bindable `checked` and optional `disabled` states.

## What it is

`TaskListItem` is a headless Svelte 5 component representing one task row inside a `TaskList`. It renders a `<li>` with a native checkbox input wrapped in a `<label>`, exposing `checked` as a bindable two-way value and forwarding `disabled` to the underlying input.

## What it does

- Renders an `<li>` element with the base class `task-list-item`.
- Exposes `data-checked` and `data-disabled` attributes on the `<li>` so consumers can target the element for visual styling based on state.
- Contains a `<label>` wrapping a native `<input type="checkbox">` bound via `bind:checked`.
- Displays the task description text from the `label` prop inside the `<label>`.
- Supports the `disabled` attribute on the checkbox.
- Spreads additional HTML attributes onto the `<li>`.

## When to use it

- As a direct child of `TaskList` to add a task item with a checkbox.
- For to-do style interactions where each row is independently toggleable.
- Inside a surrounding `<ol>` or `<ul>` where each item needs a checkbox + label pair.

## When not to use it

- Don't use it outside a list — it renders a bare `<li>` which is invalid as a direct child of most elements.
- Don't use it when you need a multi-line rich item — prefer rolling your own `<li>` with more complex children.
- Don't use it for radio-style mutually exclusive options — use `RadioInput`/`RadioGroup` instead.
- Don't use it for navigation links — use `TreeListItem` or similar.

## How to use it

Import the component and place it inside a `TaskList` (or any `<ol>`/`<ul>`). Supply the required `label` text and bind `checked` for two-way state.

## Props

- `class` — string, optional. Extra CSS class appended to `task-list-item`.
- `label` — string, required. The visible task description text.
- `checked` — boolean, default `false`, bindable via `bind:checked`. Whether the task is completed.
- `disabled` — boolean, default `false`. Whether the checkbox is disabled.
- `...restProps` — any additional HTML attributes spread onto the `<li>`.

## Usage

```svelte
<script lang="ts">
  import TaskListItem from "./TaskListItem.svelte";

  let done = $state(false);
</script>

<ol>
  <TaskListItem label="Write release notes" bind:checked={done} />
</ol>
```

```svelte
<script lang="ts">
  import TaskList from "../TaskList/TaskList.svelte";
  import TaskListItem from "./TaskListItem.svelte";
</script>

<TaskList label="Today">
  <TaskListItem label="Buy groceries" />
  <TaskListItem label="Clean house" checked />
  <TaskListItem label="Archived task" checked disabled />
</TaskList>
```

```svelte
<script lang="ts">
  import TaskList from "../TaskList/TaskList.svelte";
  import TaskListItem from "./TaskListItem.svelte";

  const items = $state([
    { id: 1, label: "Ship PR", checked: true },
    { id: 2, label: "Review tickets", checked: false },
  ]);
  let count = $derived(items.filter((i) => i.checked).length);
</script>

<p>Completed: {count} / {items.length}</p>
<TaskList label="Sprint tasks">
  {#each items as it (it.id)}
    <TaskListItem label={it.label} bind:checked={it.checked} />
  {/each}
</TaskList>
```

```svelte
<script lang="ts">
  import TaskListItem from "./TaskListItem.svelte";
</script>

<ol aria-label="Blocked items">
  <TaskListItem
    label="Waiting on legal review"
    disabled
    data-reason="legal-hold"
  />
</ol>
```

## Accessibility

- Native `<input type="checkbox">` provides the `checkbox` role, focus handling, `Space` to toggle, and ARIA state.
- The `<label>` wrap associates the visible text with the checkbox without requiring an `id`.
- `data-checked` and `data-disabled` attributes on the `<li>` are available for styling hooks; they do not replace ARIA — the native checkbox's `aria-checked` state is what assistive technology announces.
- `disabled` removes the checkbox from the tab sequence and is conveyed to screen readers.

## Related components

- `TaskList` — the parent list container for `TaskListItem` children.
- `CheckListItem` — similar but inside a `CheckList`.
- `CheckboxInput` — the lower-level checkbox primitive for custom compositions.

---

Lily™ and Lily Design System™ are trademarks.
