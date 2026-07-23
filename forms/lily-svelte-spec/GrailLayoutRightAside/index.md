# GrailLayoutRightAside

A headless structural wrapper for the right aside slot of a `GrailLayout`. It typically contains supplementary content, ads, related links, or contextual information.

## What it is

A Svelte 5 component that renders a semantic `<aside class="grail-layout-right-aside ...">` around the `children` snippet, providing the `complementary` landmark.

## What it does

- Renders `<aside class="grail-layout-right-aside ...">` wrapping the `children` snippet.
- Spreads any additional HTML attributes onto the `<aside>`.

## When to use it

- As the right-side slot inside `GrailLayout` for related content, ads, on-this-page links, etc.
- When you need the `grail-layout-right-aside` hook class for consumer CSS.

## When not to use it

- For a floating panel overlay. Use `FloatingPanel`, `Popover`, or `Sheet`.
- For a primary navigation sidebar. Use `GrailLayoutLeftAside` or `Sidebar`.

## How to use it

Place as a direct child of `GrailLayout`. The component itself provides the `complementary` landmark via its `<aside>` element.

## Props

- `class` (string, optional) - CSS class appended after the base `grail-layout-right-aside` class.
- `children` (Snippet, required) - Content for the right aside slot.
- `...restProps` - Additional HTML attributes spread onto the `<aside>`.

## Usage

```svelte
<script lang="ts">
    import GrailLayoutRightAside from "./GrailLayoutRightAside.svelte";
</script>

<GrailLayoutRightAside>
    <aside aria-label="Related">
        <h2>Related</h2>
        <ul><li><a href="/r1">Related 1</a></li></ul>
    </aside>
</GrailLayoutRightAside>
```

```svelte
<script lang="ts">
    import GrailLayout from "../GrailLayout/GrailLayout.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
    import GrailLayoutRightAside from "./GrailLayoutRightAside.svelte";
</script>

<GrailLayout>
    <GrailLayoutCenterMain><main>Body</main></GrailLayoutCenterMain>
    <GrailLayoutRightAside>
        <aside>On this page...</aside>
    </GrailLayoutRightAside>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayoutRightAside from "./GrailLayoutRightAside.svelte";
</script>

<GrailLayoutRightAside class="narrow-right" data-testid="grail-right">
    <aside><p>Sponsored</p></aside>
</GrailLayoutRightAside>
```

```svelte
<script lang="ts">
    import GrailLayoutRightAside from "./GrailLayoutRightAside.svelte";
    const onPage = [
        { id: "intro", label: "Introduction" },
        { id: "usage", label: "Usage" },
    ];
</script>

<GrailLayoutRightAside>
    <aside aria-label="On this page">
        <nav>
            <ul>
                {#each onPage as p}
                    <li><a href={`#${p.id}`}>{p.label}</a></li>
                {/each}
            </ul>
        </nav>
    </aside>
</GrailLayoutRightAside>
```

```svelte
<script lang="ts">
    import GrailLayoutRightAside from "./GrailLayoutRightAside.svelte";
</script>

<GrailLayoutRightAside hidden={false}>
    <aside aria-label="Help">
        <p>Need help? Contact support.</p>
    </aside>
</GrailLayoutRightAside>
```

## Accessibility

- The rendered element is `<aside>`, which exposes the `complementary` landmark.
- Label the component with `aria-label` (via `restProps`) when multiple asides exist on the page.

## Related components

- `GrailLayout` - parent layout container.
- `GrailLayoutTopHeader`, `GrailLayoutLeftAside`, `GrailLayoutCenterMain`, `GrailLayoutBottomFooter` - sibling slots.
- `Sidebar` - dedicated side-panel component.
- `FloatingPanel` - overlay floating panel (not in-layout).

---

Lily™ and Lily Design System™ are trademarks.
