# CheckList

A headless ordered list container for `CheckListItem` children. It renders an `<ol>` with `role="list"` and an optional `aria-label`. Used in to-do lists, onboarding flows, forms, and progress tracking.

## What it is

CheckList is a semantic list container. Although the AGENTS documentation describes CheckList as "an ordered list", the source emits an `<ol>` with an explicit `role="list"` (the explicit role preserves list semantics in CSS that sets `list-style: none`).

Note: the component does not apply `aria-label` to a `<ul>`; it applies it to the `<ol>`. The AGENTS snippet showing `<ul>` in the description is inaccurate relative to the source.

## What it does

- Renders `<ol role="list" aria-label={label}>`.
- Renders children inside the list.
- Spreads `restProps` onto the `<ol>`.

## When to use it

- Tracking progress through a checklist of tasks or steps.
- Onboarding checklists with completed items.
- Guideline "do this" lists (alongside `DoList` for the affirmative pattern variant).

## When not to use it

- For an unordered set of checkboxes not representing tasks — use `CheckboxGroup`.
- For hierarchical navigation — use `TreeList` / `TreeNav`.
- For a key/value summary — use `SummaryList`.

## How to use it

Compose with `CheckListItem` children. Provide a `label` to describe the list's purpose for assistive technology.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name (note: current source does not apply a base class to the `<ol>`). |
| `label` | `string` | `undefined` | Accessible label for the list. |
| `children` | `Snippet` | required | `CheckListItem` components. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<ol>`. |

## Usage

```svelte
<script lang="ts">
    import CheckList from "./CheckList.svelte";
    import CheckListItem from "../CheckListItem/CheckListItem.svelte";
</script>

<CheckList label="Onboarding tasks">
    <CheckListItem checked>Create account</CheckListItem>
    <CheckListItem>Set up profile</CheckListItem>
    <CheckListItem>Invite team members</CheckListItem>
</CheckList>
```

```svelte
<script lang="ts">
    import CheckList from "./CheckList.svelte";
    import CheckListItem from "../CheckListItem/CheckListItem.svelte";
</script>

<CheckList label="Pre-flight checks">
    <CheckListItem checked>Review content</CheckListItem>
    <CheckListItem checked>Run tests</CheckListItem>
    <CheckListItem>Deploy to staging</CheckListItem>
    <CheckListItem disabled>Deploy to production (admin only)</CheckListItem>
</CheckList>
```

```svelte
<script lang="ts">
    import CheckList from "./CheckList.svelte";
    import CheckListItem from "../CheckListItem/CheckListItem.svelte";

    let steps = $state([
        { id: 1, label: "Read the docs", done: true },
        { id: 2, label: "Run the demo", done: false },
        { id: 3, label: "Ship it", done: false }
    ]);
</script>

<CheckList label="Tutorial">
    {#each steps as step (step.id)}
        <CheckListItem checked={step.done}>{step.label}</CheckListItem>
    {/each}
</CheckList>
```

```svelte
<script lang="ts">
    import CheckList from "./CheckList.svelte";
    import CheckListItem from "../CheckListItem/CheckListItem.svelte";
</script>

<CheckList label="Morning routine">
    <CheckListItem checked>Hydrate</CheckListItem>
    <CheckListItem>Stretch</CheckListItem>
    <CheckListItem>Review calendar</CheckListItem>
</CheckList>
```

## Accessibility

- Explicit `role="list"` preserves list semantics even when visual styles strip list markers.
- `aria-label` names the list for assistive technology.
- Each `CheckListItem` uses a native `<input type="checkbox">` inside a `<label>` for keyboard support and screen-reader announcement.

## Related components

- `CheckListItem` — a list item with a checkbox and label.
- `DoList`, `DontList` — guideline lists.
- `TaskList`, `TaskListItem` — task-tracking list.
