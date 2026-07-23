# Footer

A semantic page or section footer that renders a native HTML `<footer>` element. Typically placed at the bottom of a page or region to provide secondary navigation, legal information, contact details, or links to important but less prominent content.

## What it is

A Svelte 5 component that renders a `<footer>` element with the base class `footer`. The native `<footer>` element provides the `contentinfo` landmark role when placed directly in `<body>`.

## What it does

- Renders `<footer class="footer ...">` around the `children` snippet.
- When `label` is provided, sets `aria-label` so screen readers can distinguish between multiple footers.
- Spreads any additional HTML attributes onto the `<footer>` element.

## When to use it

- Page-level footers containing copyright, legal links, contact info, or site-wide navigation.
- Section-level footers inside an `<article>` or `<section>` containing byline, timestamps, or related links.
- Any context where semantic `<footer>` content is appropriate.

## When not to use it

- For the bottom strip of the Grail Layout. Use `GrailLayoutBottomFooter` (a structural wrapper).
- For page headers. Use `Header`.
- For generic content panels. Use `Panel`.
- When the footer also needs a fixed aspect ratio or layout behaviour, wrap in an appropriate container.

## How to use it

Wrap any footer-appropriate content in `<Footer>...</Footer>`. Supply `label` only when the page contains more than one `<footer>` element and they need to be distinguishable by assistive technology.

## Props

- `class` (string, optional) - CSS class appended after the base `footer` class.
- `label` (string, optional) - Accessible name applied via `aria-label`. Useful to distinguish multiple footers.
- `children` (Snippet, required) - Footer content.
- `...restProps` - Additional HTML attributes spread onto the `<footer>` element.

## Usage

```svelte
<script lang="ts">
    import Footer from "./Footer.svelte";
</script>

<Footer label="Site footer">
    <p>Copyright 2026</p>
</Footer>
```

```svelte
<script lang="ts">
    import Footer from "./Footer.svelte";
</script>

<Footer>
    <nav aria-label="Footer navigation">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/contact">Contact</a>
    </nav>
</Footer>
```

```svelte
<script lang="ts">
    import Footer from "./Footer.svelte";
</script>

<article>
    <h1>Article title</h1>
    <p>Body content...</p>
    <Footer label="Article footer">
        <p>Published 2026-04-18 by Jamie</p>
    </Footer>
</article>
```

```svelte
<script lang="ts">
    import Footer from "./Footer.svelte";
</script>

<Footer class="site-footer" data-testid="site-footer">
    <div>
        <h2>Contact</h2>
        <p>hello@example.com</p>
    </div>
    <div>
        <h2>Links</h2>
        <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/careers">Careers</a></li>
        </ul>
    </div>
</Footer>
```

```svelte
<script lang="ts">
    import Footer from "./Footer.svelte";
</script>

<Footer label="Page footer">
    <small>All rights reserved.</small>
</Footer>
<Footer label="App footer">
    <small>Build 123.4.5</small>
</Footer>
```

## Accessibility

- `<footer>` provides the `contentinfo` landmark when it is a direct child of `<body>`.
- When nested inside an article or section, it is treated as that region's footer.
- `aria-label` can distinguish multiple footers for assistive tech users.
- No keyboard behaviour built-in; interactions come from child elements (links, buttons, etc.).

## Related components

- `Header` - page or section header landmark.
- `GrailLayoutBottomFooter` - structural `<div>` wrapper for the Grail Layout bottom slot.
- `GrailLayout` - Grail Layout container.
- `Panel` - generic content panel.

---

Lily™ and Lily Design System™ are trademarks.
