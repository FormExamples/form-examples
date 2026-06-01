# CheckListItem

A single item within a `CheckList`. It renders an `<li>` containing a `<label>` that wraps a native `<input type="checkbox">` and the item text. Supports `checked` and `disabled` states via native attributes.

## What it is

CheckListItem is a Svelte 5 component rendering:

```html
<li>
  <label>
    <input type="checkbox" />
    {children}
  </label>
</li>
```

The checkbox's `checked` and `disabled` attributes mirror the props. Note that `checked` is not bindable in the current source; it is a one-way prop.

## What it does

- Renders an `<li>` wrapping a `<label>` wrapping an `<input type="checkbox">` and the children text.
- Applies `checked` and `disabled` to the checkbox.
- Spreads `restProps` onto the `<li>`.

## When to use it

- Inside a `CheckList` to show a checkable task, step, or option.
- For a larger click target (the `<label>` wraps the input and text).

## When not to use it

- Outside a `CheckList` — use `CheckboxInput` or wrap a plain checkbox with a `<label>`.
- For hierarchical items with children — use `TreeListItem`.

## How to use it

Place as a child of `CheckList`. Pass the item text as children.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name (note: not applied to the `<li>` in current source). |
| `checked` | `boolean` | `false` | Whether the checkbox is checked. |
| `disabled` | `boolean` | `false` | Whether the checkbox is disabled. |
| `children` | `Snippet` | required | Label content for the item. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<li>`. |

## Usage

```svelte
<script lang="ts">
    import CheckList from "../CheckList/CheckList.svelte";
    import CheckListItem from "./CheckListItem.svelte";
</script>

<CheckList label="Onboarding tasks">
    <CheckListItem checked>Create account</CheckListItem>
    <CheckListItem>Set up profile</CheckListItem>
    <CheckListItem disabled>Invite team (admin only)</CheckListItem>
</CheckList>
```

```svelte
<script lang="ts">
    import CheckList from "../CheckList/CheckList.svelte";
    import CheckListItem from "./CheckListItem.svelte";
</script>

<CheckList label="Release checklist">
    <CheckListItem checked>Version bumped</CheckListItem>
    <CheckListItem checked>Changelog updated</CheckListItem>
    <CheckListItem>Tag pushed</CheckListItem>
</CheckList>
```

```svelte
<script lang="ts">
    import CheckList from "../CheckList/CheckList.svelte";
    import CheckListItem from "./CheckListItem.svelte";

    let tasks = $state([
        { id: "a", label: "Draft plan", done: true },
        { id: "b", label: "Share with team", done: false },
        { id: "c", label: "Collect feedback", done: false }
    ]);
</script>

<CheckList label="Today">
    {#each tasks as t (t.id)}
        <CheckListItem checked={t.done}>{t.label}</CheckListItem>
    {/each}
</CheckList>
```

## Accessibility

- The `<label>` wraps the checkbox and text, giving a larger hit target and associating the label with the input natively.
- Native `<input type="checkbox">` supports Tab focus and Space to toggle.
- `disabled` prevents interaction and is respected by keyboard, pointer, and assistive tech.

## Related components

- `CheckList` — parent container.
- `CheckboxInput` — bare checkbox input.
- `TaskListItem` — task-tracking list item.
