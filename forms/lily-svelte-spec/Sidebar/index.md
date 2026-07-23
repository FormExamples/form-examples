# Sidebar

A headless complementary landmark rendered as a semantic `<aside>` with an accessible label.

## What it is

A Svelte 5 headless component that renders `<aside class="sidebar ...">` with `aria-label` and the supplied `children`.

## What it does

- Renders the semantic `<aside>` element, which exposes the implicit ARIA `complementary` landmark role.
- Applies a required `aria-label` so screen readers can distinguish this sidebar from other complementary regions on the page.
- Forwards any additional attributes onto the `<aside>` via `...restProps`.

No state, no animation, no layout - the consumer controls positioning (left, right, sticky, collapsible, etc.) via CSS.

## When to use it

- Navigation sidebars adjacent to main content.
- Filter panels, related links, tables of contents, author bios.
- Any content that is tangentially related to the main article and belongs in a landmark.

## When not to use it

- The primary site header - use `Header`.
- A page-wide navigation bar - use `NavigationMenu` or a `<nav>`-based composition.
- Modal drawers that slide over content - use `Sheet` or `SlideOutDrawer`.
- Full-bleed grail-layout asides - use `GrailLayoutLeftAside` / `GrailLayoutRightAside`.

## How to use it

1. Import the component.
2. Provide a translated `label`.
3. Put the sidebar's content in the `children` snippet.
4. Add CSS for width, position, sticky behavior, etc.

## Props

- `class` (string, optional, default `""`) - merged with the base `sidebar` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - sidebar content.
- `...restProps` - spread onto `<aside>`.

## Usage

Navigation sidebar:

```svelte
<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
</script>

<Sidebar label="Primary navigation">
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</Sidebar>
```

Filter sidebar:

```svelte
<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
</script>

<Sidebar label="Filters">
    <form>
        <label>Category <select><option>News</option></select></label>
    </form>
</Sidebar>
```

Related-articles sidebar:

```svelte
<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
</script>

<Sidebar label="Related articles">
    <ul>
        <li><a href="/a">Article A</a></li>
        <li><a href="/b">Article B</a></li>
    </ul>
</Sidebar>
```

Sidebar + main content (grail-layout-like pattern):

```svelte
<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
</script>

<div class="layout">
    <Sidebar label="Docs navigation">
        <nav>...</nav>
    </Sidebar>
    <main>
        <h1>Page</h1>
    </main>
</div>
```

With custom ID and class:

```svelte
<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
</script>

<Sidebar label="Table of contents" id="toc" class="sticky">
    <ol><li><a href="#intro">Introduction</a></li></ol>
</Sidebar>
```

## Accessibility

- `<aside>` provides the `complementary` landmark role.
- `aria-label` is required to disambiguate multiple sidebars on one page.
- No keyboard interaction is built in; interactive content inside (links, buttons) retains native behavior.

References:
- WAI-ARIA Complementary Role: https://www.w3.org/TR/wai-aria-1.2/#complementary
- MDN `<aside>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside

## Related components

- `GrailLayoutLeftAside`, `GrailLayoutRightAside` - grail-layout asides.
- `NavigationMenu`, `TreeNav` - navigation patterns.
- `Sheet`, `SlideOutDrawer` - modal side overlays.
- `Footer`, `Header` - other landmark regions.

---

Lily™ and Lily Design System™ are trademarks.
