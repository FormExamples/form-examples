# GrailLayoutLeftAside

A headless structural wrapper for the left aside slot of a `GrailLayout`. It typically contains navigation menus, filters, or supplementary content.

## What it is

A Svelte 5 component that renders a semantic `<aside class="grail-layout-left-aside ...">` around the `children` snippet, providing the `complementary` landmark.

## What it does

- Renders `<aside class="grail-layout-left-aside ...">` wrapping the `children` snippet.
- Spreads any additional HTML attributes onto the `<aside>`.

## When to use it

- As the left-side slot inside `GrailLayout` for primary navigation, filters, or a sidebar.
- When you need the `grail-layout-left-aside` hook class for consumer CSS.

## When not to use it

- For a slide-out drawer. Use `Drawer`, `Sheet`, or `SlideOutDrawer`.
- For a resizable sidebar with a drag handle. Use `Resizable` or `Splitter` with `Sidebar`.

## How to use it

Place as a direct child of `GrailLayout`. The component itself provides the `complementary` landmark via its `<aside>` element. For navigation content, nest a `<nav>` inside.

## Props

- `class` (string, optional) - CSS class appended after the base `grail-layout-left-aside` class.
- `children` (Snippet, required) - Content for the left aside slot.
- `...restProps` - Additional HTML attributes spread onto the `<aside>`.

## Usage

```svelte
<script lang="ts">
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
</script>

<GrailLayoutLeftAside>
    <nav aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</GrailLayoutLeftAside>
```

```svelte
<script lang="ts">
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
</script>

<GrailLayoutLeftAside>
    <aside aria-label="Filters">
        <h2>Filters</h2>
        <label><input type="checkbox" /> Active</label>
    </aside>
</GrailLayoutLeftAside>
```

```svelte
<script lang="ts">
    import GrailLayout from "../GrailLayout/GrailLayout.svelte";
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
</script>

<GrailLayout>
    <GrailLayoutLeftAside>
        <nav aria-label="Primary">...</nav>
    </GrailLayoutLeftAside>
    <GrailLayoutCenterMain><main>Content</main></GrailLayoutCenterMain>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
</script>

<GrailLayoutLeftAside class="narrow-left" data-testid="grail-left">
    <aside><p>Ad slot</p></aside>
</GrailLayoutLeftAside>
```

```svelte
<script lang="ts">
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
    const items = [
        { href: "/", label: "Home" },
        { href: "/docs", label: "Docs" },
        { href: "/help", label: "Help" },
    ];
</script>

<GrailLayoutLeftAside>
    <nav aria-label="Primary">
        <ul>
            {#each items as i}<li><a href={i.href}>{i.label}</a></li>{/each}
        </ul>
    </nav>
</GrailLayoutLeftAside>
```

## Accessibility

- The rendered element is `<aside>`, which exposes the `complementary` landmark.
- Give the component an `aria-label` (via `restProps`) or any inner `<nav>` an `aria-label` when multiple navs/asides are on the page.

## Related components

- `GrailLayout` - parent layout container.
- `GrailLayoutTopHeader`, `GrailLayoutCenterMain`, `GrailLayoutRightAside`, `GrailLayoutBottomFooter` - sibling slots.
- `Sidebar` - dedicated side-panel component.
- `NavigationMenu` - site-wide navigation menu.
