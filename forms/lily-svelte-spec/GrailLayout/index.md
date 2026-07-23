# GrailLayout

A headless container that frames the classic "holy grail" web-design structure of five sections: a full-width top header, a left aside, a center main area, a right aside, and a full-width bottom footer.

## What it is

A Svelte 5 component that renders a plain `<div class="grail-layout ...">` wrapping the `children` snippet. Despite describing a layout, it applies no layout styles and emits no semantic landmarks - consumers supply all CSS (Grid, Flexbox, or any other strategy).

## What it does

- Renders `<div class="grail-layout ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<div>`.

## When to use it

- As the outer wrapper for a page that composes `GrailLayoutTopHeader`, `GrailLayoutLeftAside`, `GrailLayoutCenterMain`, `GrailLayoutRightAside`, and `GrailLayoutBottomFooter` slots.
- When you want a deterministic set of layout slot classes that consumer CSS can target (e.g. `.grail-layout`, `.grail-layout-top-header`, etc.).

## When not to use it

- For small in-page layouts. Use `Card`, `Panel`, or `ArticleLayout`.
- When you need semantic landmarks at the outer layout level. The component renders a `<div>`; add `<header>`/`<main>`/etc. as children inside the slots.
- When a sidebar/drawer pattern is more appropriate. Use `Sidebar`, `Drawer`, or `Sheet`.

## How to use it

Compose all five slot components as children of `GrailLayout`. The slot components are thin `<div>` wrappers; place real semantic elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) inside them where desired.

## Props

- `class` (string, optional) - CSS class appended after the base `grail-layout` class.
- `children` (Snippet, required) - Layout slot elements.
- `...restProps` - Additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
    import GrailLayout from "./GrailLayout.svelte";
    import GrailLayoutTopHeader from "../GrailLayoutTopHeader/GrailLayoutTopHeader.svelte";
    import GrailLayoutLeftAside from "../GrailLayoutLeftAside/GrailLayoutLeftAside.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
    import GrailLayoutRightAside from "../GrailLayoutRightAside/GrailLayoutRightAside.svelte";
    import GrailLayoutBottomFooter from "../GrailLayoutBottomFooter/GrailLayoutBottomFooter.svelte";
</script>

<GrailLayout>
    <GrailLayoutTopHeader>
        <header><h1>Site</h1></header>
    </GrailLayoutTopHeader>
    <GrailLayoutLeftAside>
        <nav aria-label="Primary">...</nav>
    </GrailLayoutLeftAside>
    <GrailLayoutCenterMain>
        <main><h2>Welcome</h2></main>
    </GrailLayoutCenterMain>
    <GrailLayoutRightAside>
        <aside>Related content</aside>
    </GrailLayoutRightAside>
    <GrailLayoutBottomFooter>
        <footer><small>Copyright 2026</small></footer>
    </GrailLayoutBottomFooter>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayout from "./GrailLayout.svelte";
    import GrailLayoutTopHeader from "../GrailLayoutTopHeader/GrailLayoutTopHeader.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
    import GrailLayoutBottomFooter from "../GrailLayoutBottomFooter/GrailLayoutBottomFooter.svelte";
</script>

<GrailLayout class="app-shell">
    <GrailLayoutTopHeader><header>Header</header></GrailLayoutTopHeader>
    <GrailLayoutCenterMain><main>Content only</main></GrailLayoutCenterMain>
    <GrailLayoutBottomFooter><footer>Footer</footer></GrailLayoutBottomFooter>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayout from "./GrailLayout.svelte";
    import GrailLayoutTopHeader from "../GrailLayoutTopHeader/GrailLayoutTopHeader.svelte";
    import GrailLayoutLeftAside from "../GrailLayoutLeftAside/GrailLayoutLeftAside.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
    import GrailLayoutBottomFooter from "../GrailLayoutBottomFooter/GrailLayoutBottomFooter.svelte";
    let menuOpen = $state(false);
</script>

<GrailLayout>
    <GrailLayoutTopHeader>
        <header>
            <button onclick={() => (menuOpen = !menuOpen)}>Menu</button>
        </header>
    </GrailLayoutTopHeader>
    {#if menuOpen}
        <GrailLayoutLeftAside>
            <nav aria-label="Main">...</nav>
        </GrailLayoutLeftAside>
    {/if}
    <GrailLayoutCenterMain><main>Body</main></GrailLayoutCenterMain>
    <GrailLayoutBottomFooter><footer>Footer</footer></GrailLayoutBottomFooter>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayout from "./GrailLayout.svelte";
    import GrailLayoutTopHeader from "../GrailLayoutTopHeader/GrailLayoutTopHeader.svelte";
    import GrailLayoutLeftAside from "../GrailLayoutLeftAside/GrailLayoutLeftAside.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
    import GrailLayoutRightAside from "../GrailLayoutRightAside/GrailLayoutRightAside.svelte";
    import GrailLayoutBottomFooter from "../GrailLayoutBottomFooter/GrailLayoutBottomFooter.svelte";
</script>

<GrailLayout
    class="themed-grail"
    data-testid="grail"
    aria-label="Application shell"
>
    <GrailLayoutTopHeader><header>Header</header></GrailLayoutTopHeader>
    <GrailLayoutLeftAside><nav>Left</nav></GrailLayoutLeftAside>
    <GrailLayoutCenterMain><main>Main</main></GrailLayoutCenterMain>
    <GrailLayoutRightAside><aside>Right</aside></GrailLayoutRightAside>
    <GrailLayoutBottomFooter><footer>Footer</footer></GrailLayoutBottomFooter>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayout from "./GrailLayout.svelte";
    import GrailLayoutTopHeader from "../GrailLayoutTopHeader/GrailLayoutTopHeader.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
    import GrailLayoutBottomFooter from "../GrailLayoutBottomFooter/GrailLayoutBottomFooter.svelte";
    import Header from "../Header/Header.svelte";
    import Footer from "../Footer/Footer.svelte";
</script>

<GrailLayout>
    <GrailLayoutTopHeader>
        <Header label="Site">
            <h1>My site</h1>
        </Header>
    </GrailLayoutTopHeader>
    <GrailLayoutCenterMain>
        <main>
            <p>Main content.</p>
        </main>
    </GrailLayoutCenterMain>
    <GrailLayoutBottomFooter>
        <Footer label="Site footer">
            <small>Copyright 2026</small>
        </Footer>
    </GrailLayoutBottomFooter>
</GrailLayout>
```

## Accessibility

- No ARIA attributes are applied to the outer `<div>`.
- Semantic landmarks should be added inside each slot (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) - the slot components themselves render plain `<div>`s.
- Consumer CSS handles visual layout; assistive-tech landmark navigation depends on the semantic children you place in each slot.

## Related components

- `GrailLayoutTopHeader` - top full-width slot.
- `GrailLayoutLeftAside` - left side slot.
- `GrailLayoutCenterMain` - center main slot.
- `GrailLayoutRightAside` - right side slot.
- `GrailLayoutBottomFooter` - bottom full-width slot.
- `Header`, `Footer` - semantic landmark components you can place inside slots.
- `ArticleLayout` - narrower article layout.

---

Lily™ and Lily Design System™ are trademarks.
