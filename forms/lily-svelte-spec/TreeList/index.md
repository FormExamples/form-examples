# TreeList

A headless hierarchical list rendered as `<ol role="tree">` with built-in arrow-key / Home / End navigation between descendant `[role="treeitem"]` elements.

## What it is

`TreeList` is a Svelte 5 component implementing the WAI-ARIA tree pattern. It renders an `<ol>` with `role="tree"` and manages focus movement across descendant tree items via `ArrowDown`, `ArrowUp`, `Home`, and `End` with wraparound at boundaries.

## What it does

- Renders `<ol class="tree-list {className}" role="tree" aria-label={label}>`.
- Stores a DOM ref and, on arrow / Home / End keypresses, finds all descendants matching `[role='treeitem']` and moves focus accordingly.
- Wraps focus at boundaries (down from last → first, up from first → last).
- Renders the `children` snippet.
- Spreads additional HTML attributes onto the `<ol>`.

## When to use it

- File browsers and directory tree views.
- Organizational charts and hierarchical employee listings.
- Nested category lists and taxonomy browsers.
- Any hierarchy of items expressed as an ordered list.

## When not to use it

- Don't use it for flat, non-hierarchical content — use `TaskList` or a plain `<ul>`.
- Don't use it for navigation where `role="tree"` is semantically wrong — use `NavigationMenu` or `TreeNav` for nav semantics.
- Don't use it for tabular hierarchy — use `DataTable`.
- Don't use it for kanban / status groupings — use `KanbanTable`.

## How to use it

Import and provide `<li role="treeitem" tabindex="-1">` children (the first visible item commonly uses `tabindex="0"`). Pass a translated `label`.

## Props

- `class` — string, optional. Extra CSS class appended to `tree-list`.
- `label` — string, required. Accessible name via `aria-label`.
- `children` — Snippet, required. Tree item elements with `role="treeitem"`.
- `...restProps` — any additional HTML attributes spread onto the `<ol>`.

## Usage

```svelte
<script lang="ts">
  import TreeList from "./TreeList.svelte";
</script>

<TreeList label="File browser">
  <li role="treeitem" tabindex="0">Documents</li>
  <li role="treeitem" tabindex="-1">Photos</li>
  <li role="treeitem" tabindex="-1">Videos</li>
</TreeList>
```

```svelte
<script lang="ts">
  import TreeList from "./TreeList.svelte";

  const rows = ["Home", "About", "Contact"];
</script>

<TreeList label="Site map">
  {#each rows as r, i}
    <li role="treeitem" tabindex={i === 0 ? 0 : -1}>{r}</li>
  {/each}
</TreeList>
```

```svelte
<script lang="ts">
  import TreeList from "./TreeList.svelte";
</script>

<TreeList label="Org chart">
  <li role="treeitem" tabindex="0" aria-expanded="true">
    Engineering
    <ol role="group">
      <li role="treeitem" tabindex="-1">Frontend</li>
      <li role="treeitem" tabindex="-1">Backend</li>
    </ol>
  </li>
  <li role="treeitem" tabindex="-1" aria-expanded="false">Design</li>
</TreeList>
```

```svelte
<script lang="ts">
  import TreeList from "./TreeList.svelte";

  let selected = $state("Home");
</script>

<TreeList label="Sections">
  <li
    role="treeitem"
    tabindex="0"
    aria-selected={selected === "Home"}
    onclick={() => (selected = "Home")}
  >
    Home
  </li>
  <li
    role="treeitem"
    tabindex="-1"
    aria-selected={selected === "About"}
    onclick={() => (selected = "About")}
  >
    About
  </li>
</TreeList>
<p>Selected: {selected}</p>
```

## Accessibility

- `role="tree"` identifies the container as a tree widget.
- `aria-label` supplies the accessible name.
- Keyboard:
  - `ArrowDown` / `ArrowUp` move focus between tree items, wrapping around.
  - `Home` / `End` jump to first/last items.
- Consumers should use `role="treeitem"` and `tabindex="-1"` on items (with one item getting `tabindex="0"` for initial tab stop).
- For nested levels, children should use `role="group"` wrappers and `aria-expanded` on the parent item.

## Related components

- `TreeNav` — the same tree pattern rendered as `<ul>` and intended for navigation.
- `TreeListItem` — helper item component.
- `TreeMenu` — hierarchical menu variant.
- `ContentsList` — table-of-contents flat list.
