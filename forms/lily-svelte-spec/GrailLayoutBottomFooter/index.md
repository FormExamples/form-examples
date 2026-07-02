# GrailLayoutBottomFooter

A headless structural wrapper for the bottom slot of a `GrailLayout`. It spans the full width of the layout and typically contains copyright, links, or site-wide footer content.

## What it is

A Svelte 5 component that renders a semantic `<footer class="grail-layout-bottom-footer ...">` around the `children` snippet, providing the `contentinfo` landmark.

## What it does

- Renders `<footer class="grail-layout-bottom-footer ...">` wrapping the `children` snippet.
- Spreads any additional HTML attributes onto the `<footer>`.

## When to use it

- As the bottom slot inside `GrailLayout`.
- When you need the `grail-layout-bottom-footer` hook class for consumer CSS (e.g. to position the slot in a CSS Grid layout).

## When not to use it

- For section-level footers inside articles. Use `Footer` directly where needed.

## How to use it

Place as a direct child of `GrailLayout`. The component itself provides the `contentinfo` landmark via its `<footer>` element.

## Props

- `class` (string, optional) - CSS class appended after the base `grail-layout-bottom-footer` class.
- `children` (Snippet, required) - Content for the bottom slot.
- `...restProps` - Additional HTML attributes spread onto the `<footer>`.

## Usage

```svelte
<script lang="ts">
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
</script>

<GrailLayoutBottomFooter>
    <footer><small>Copyright 2026</small></footer>
</GrailLayoutBottomFooter>
```

```svelte
<script lang="ts">
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
    import Footer from "../Footer/Footer.svelte";
</script>

<GrailLayoutBottomFooter>
    <Footer label="Site footer">
        <nav aria-label="Footer">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
        </nav>
    </Footer>
</GrailLayoutBottomFooter>
```

```svelte
<script lang="ts">
    import GrailLayout from "../GrailLayout/GrailLayout.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
</script>

<GrailLayout>
    <GrailLayoutCenterMain><main>Content</main></GrailLayoutCenterMain>
    <GrailLayoutBottomFooter><footer>Footer</footer></GrailLayoutBottomFooter>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
</script>

<GrailLayoutBottomFooter class="site-bottom" data-testid="grail-bottom">
    <footer>
        <p>Custom footer with hooks.</p>
    </footer>
</GrailLayoutBottomFooter>
```

```svelte
<script lang="ts">
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
    const links = [
        { href: "/about", text: "About" },
        { href: "/jobs", text: "Jobs" },
    ];
</script>

<GrailLayoutBottomFooter>
    <footer>
        <ul>
            {#each links as l}<li><a href={l.href}>{l.text}</a></li>{/each}
        </ul>
    </footer>
</GrailLayoutBottomFooter>
```

## Accessibility

- The rendered element is `<footer>`, which exposes the `contentinfo` landmark when used as a top-level child of `<body>` (or the `GrailLayout` root).
- No additional ARIA applied by this component.

## Related components

- `GrailLayout` - parent layout container.
- `GrailLayoutTopHeader`, `GrailLayoutLeftAside`, `GrailLayoutCenterMain`, `GrailLayoutRightAside` - sibling slots.
- `Footer` - semantic `<footer>` landmark component.
- `Header` - semantic `<header>` landmark component.
