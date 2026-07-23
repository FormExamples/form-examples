# Header

A semantic page or section header that renders a native HTML `<header>` element. Typically used at the top of a page or region for introductory or navigational content such as headings, navigation, branding, search, or call-to-action buttons.

## What it is

A Svelte 5 component that renders a `<header>` element with the base class `header`. The native `<header>` element provides the `banner` landmark role when it is a direct child of `<body>`.

## What it does

- Renders `<header class="header ...">` around the `children` snippet.
- When `label` is provided, sets `aria-label` on the `<header>`.
- Spreads any additional HTML attributes onto the `<header>` element.

## When to use it

- Page-level headers with site branding and top-level navigation.
- Section- or article-level headers with a heading and associated byline or metadata.
- Any context where the semantic `<header>` element is appropriate.

## When not to use it

- For the top slot of the Grail Layout. Use `GrailLayoutTopHeader` as the slot, and put a `Header` (or `<header>`) inside it.
- For page footers. Use `Footer`.
- For high-priority site-wide banner messages. Use `Banner` or `SuperBanner`.

## How to use it

Wrap header content in `<Header>...</Header>`. Provide `label` when there are multiple `<header>` elements on the page and they need to be disambiguated for assistive tech.

## Props

- `class` (string, optional) - CSS class appended after the base `header` class.
- `label` (string, optional) - Accessible name via `aria-label`.
- `children` (Snippet, required) - Header content.
- `...restProps` - Additional HTML attributes spread onto the `<header>` element.

## Usage

```svelte
<script lang="ts">
    import Header from "./Header.svelte";
</script>

<Header label="Site header">
    <h1>My Site</h1>
</Header>
```

```svelte
<script lang="ts">
    import Header from "./Header.svelte";
</script>

<Header>
    <h1>Page Title</h1>
    <nav aria-label="Primary">
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</Header>
```

```svelte
<script lang="ts">
    import Header from "./Header.svelte";
</script>

<article>
    <Header label="Article header">
        <h1>Article title</h1>
        <p>By Jamie, 2026-04-18</p>
    </Header>
    <p>Body content...</p>
</article>
```

```svelte
<script lang="ts">
    import Header from "./Header.svelte";
</script>

<Header
    class="site-header"
    data-testid="site-header"
    label="Site header"
>
    <a href="/" aria-label="Home">Logo</a>
    <form role="search">
        <label>Search <input type="search" /></label>
    </form>
</Header>
```

```svelte
<script lang="ts">
    import Header from "./Header.svelte";
    import HamburgerMenu from "../HamburgerMenu/HamburgerMenu.svelte";
    let open = $state(false);
</script>

<Header label="Mobile header">
    <a href="/">Logo</a>
    <HamburgerMenu label="Menu" bind:open>
        <ul>
            <li><a href="/a">A</a></li>
            <li><a href="/b">B</a></li>
        </ul>
    </HamburgerMenu>
</Header>
```

## Accessibility

- Native `<header>` implicitly has role `banner` when it is a direct child of `<body>`; otherwise it is a generic header for its containing section.
- `aria-label` can distinguish multiple headers for assistive-tech users.
- No keyboard behaviour by default; interactions come from child elements.

## Related components

- `Footer` - semantic `<footer>` landmark.
- `GrailLayoutTopHeader` - Grail Layout structural wrapper for the top slot.
- `Banner` / `SuperBanner` - high-priority banner messages.
- `Headline` - page headline with heading and subtitle.

---

Lily™ and Lily Design System™ are trademarks.
