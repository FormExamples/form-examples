# TreeNav

A headless hierarchical navigation list rendered as `<ul role="tree">` with built-in arrow-key / Home / End keyboard navigation across descendant `[role="treeitem"]` elements.

## What it is

`TreeNav` is a Svelte 5 component that applies the WAI-ARIA tree pattern to navigation. It renders a `<ul>` with `role="tree"` and manages focus between tree items on arrow / Home / End keypresses. It is the navigation-oriented sibling of `TreeList`.

## What it does

- Renders `<ul class="tree-nav {className}" role="tree" aria-label={label}>`.
- Queries descendants with `[role="treeitem"]` and, on `ArrowDown`, `ArrowUp`, `Home`, and `End`, moves focus to the appropriate item with wraparound.
- Renders the `children` snippet.
- Spreads additional HTML attributes onto the `<ul>`.

## When to use it

- File-directory or folder navigation in a sidebar.
- Multi-level category trees for product catalogs.
- Organizational chart navigation.
- Any hierarchical navigation where the user should arrow between items.

## When not to use it

- Don't use it for flat navigation links — use a simple `<nav>` with links or `NavigationMenu`.
- Don't use it for breadcrumb trails — use `BreadcrumbNav`.
- Don't use it for page-section outlines — use `ContentsNav`.
- Don't use it when a table of tree semantics are not desired — use `TreeList` (ordered) or a plain `<ul>`.

## How to use it

Import and supply `<li role="treeitem" tabindex="-1">` children (one item with `tabindex="0"` to serve as the tab stop). Pass a translated `label` via the required `label` prop.

## Props

- `class` — string, optional. Extra CSS class appended to `tree-nav`.
- `label` — string, required. Accessible name via `aria-label`.
- `children` — Snippet, required. Tree item elements with `role="treeitem"`.
- `...restProps` — any additional HTML attributes spread onto the `<ul>`.

## Usage

```svelte
<script lang="ts">
  import TreeNav from "./TreeNav.svelte";
</script>

<TreeNav label="Main navigation">
  <li role="treeitem" tabindex="0">Home</li>
  <li role="treeitem" tabindex="-1">About</li>
  <li role="treeitem" tabindex="-1">Contact</li>
</TreeNav>
```

```svelte
<script lang="ts">
  import TreeNav from "./TreeNav.svelte";
  import TreeList from "../TreeList/TreeList.svelte";
</script>

<TreeNav label="Docs">
  <li role="treeitem" tabindex="0" aria-expanded="true">
    Getting started
    <TreeList label="Getting started topics">
      <li role="treeitem" tabindex="-1"><a href="/install">Install</a></li>
      <li role="treeitem" tabindex="-1"><a href="/setup">Setup</a></li>
    </TreeList>
  </li>
  <li role="treeitem" tabindex="-1">Guides</li>
</TreeNav>
```

```svelte
<script lang="ts">
  import TreeNav from "./TreeNav.svelte";

  const items = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
</script>

<TreeNav label="Site">
  {#each items as it, i}
    <li role="treeitem" tabindex={i === 0 ? 0 : -1}>
      <a href={it.href}>{it.label}</a>
    </li>
  {/each}
</TreeNav>
```

```svelte
<script lang="ts">
  import TreeNav from "./TreeNav.svelte";
</script>

<TreeNav label="Navigation" data-testid="tree">
  <li role="treeitem" tabindex="0" aria-selected="true">Dashboard</li>
  <li role="treeitem" tabindex="-1" aria-selected="false">Reports</li>
  <li role="treeitem" tabindex="-1" aria-selected="false">Settings</li>
</TreeNav>
```

## Accessibility

- `role="tree"` identifies the container as a tree widget.
- `aria-label` supplies the accessible name.
- Keyboard:
  - `ArrowDown` / `ArrowUp` traverse items with wrap.
  - `Home` / `End` jump to first/last.
- Consumers give items `role="treeitem"` and `tabindex="-1"`; exactly one item should have `tabindex="0"` to serve as the group's tab stop.
- For hierarchy, wrap children in `<ul role="group">` or another `TreeList` under a parent `treeitem`, and use `aria-expanded`.

## Related components

- `TreeList` — same pattern using `<ol>` for ordered lists.
- `TreeListItem` — helper item component.
- `TreeMenu` — menu-flavored tree variant.
- `NavigationMenu` / `BreadcrumbNav` — alternative navigation containers.

---

Lily™ and Lily Design System™ are trademarks.
