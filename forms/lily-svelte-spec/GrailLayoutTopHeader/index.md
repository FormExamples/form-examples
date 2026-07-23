# GrailLayoutTopHeader

A headless structural wrapper for the top slot of a `GrailLayout`. It spans the full width of the layout and typically contains site branding, primary navigation, or a top bar.

## What it is

A Svelte 5 component that renders a semantic `<header class="grail-layout-top-header ...">` around the `children` snippet, providing the `banner` landmark.

## What it does

- Renders `<header class="grail-layout-top-header ...">` wrapping the `children` snippet.
- Spreads any additional HTML attributes onto the `<header>`.

## When to use it

- As the top slot inside `GrailLayout` for the site header, logo, top nav, and user controls.
- When you need the `grail-layout-top-header` hook class for consumer CSS.

## When not to use it

- For a banner-style announcement. Use `Banner` or `SuperBanner`.
- For article or section headers. Use `Header` directly.

## How to use it

Place as a direct child of `GrailLayout`. The component itself provides the `banner` landmark via its `<header>` element.

## Props

- `class` (string, optional) - CSS class appended after the base `grail-layout-top-header` class.
- `children` (Snippet, required) - Content for the top header slot.
- `...restProps` - Additional HTML attributes spread onto the `<header>`.

## Usage

```svelte
<script lang="ts">
    import GrailLayoutTopHeader from "./GrailLayoutTopHeader.svelte";
</script>

<GrailLayoutTopHeader>
    <header><h1>Site Header</h1></header>
</GrailLayoutTopHeader>
```

```svelte
<script lang="ts">
    import GrailLayoutTopHeader from "./GrailLayoutTopHeader.svelte";
    import Header from "../Header/Header.svelte";
</script>

<GrailLayoutTopHeader>
    <Header label="Site header">
        <h1>My site</h1>
        <nav aria-label="Primary">
            <a href="/">Home</a>
            <a href="/about">About</a>
        </nav>
    </Header>
</GrailLayoutTopHeader>
```

```svelte
<script lang="ts">
    import GrailLayout from "../GrailLayout/GrailLayout.svelte";
    import GrailLayoutTopHeader from "./GrailLayoutTopHeader.svelte";
    import GrailLayoutCenterMain from "../GrailLayoutCenterMain/GrailLayoutCenterMain.svelte";
</script>

<GrailLayout>
    <GrailLayoutTopHeader>
        <header>Header</header>
    </GrailLayoutTopHeader>
    <GrailLayoutCenterMain><main>Content</main></GrailLayoutCenterMain>
</GrailLayout>
```

```svelte
<script lang="ts">
    import GrailLayoutTopHeader from "./GrailLayoutTopHeader.svelte";
</script>

<GrailLayoutTopHeader class="app-top" data-testid="grail-top">
    <header>
        <a href="/">Logo</a>
        <button>Menu</button>
    </header>
</GrailLayoutTopHeader>
```

```svelte
<script lang="ts">
    import GrailLayoutTopHeader from "./GrailLayoutTopHeader.svelte";
    import HamburgerMenu from "../HamburgerMenu/HamburgerMenu.svelte";
    let open = $state(false);
</script>

<GrailLayoutTopHeader>
    <header>
        <h1>Site</h1>
        <HamburgerMenu label="Main menu" bind:open>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/settings">Settings</a></li>
            </ul>
        </HamburgerMenu>
    </header>
</GrailLayoutTopHeader>
```

## Accessibility

- The rendered element is a `<header>`, which exposes the `banner` landmark when used as a top-level child of `<body>` (or the `GrailLayout` root).
- Use `aria-label` on the `<header>` or on inner `<nav>` elements to disambiguate when multiple exist.

## Related components

- `GrailLayout` - parent layout container.
- `GrailLayoutLeftAside`, `GrailLayoutCenterMain`, `GrailLayoutRightAside`, `GrailLayoutBottomFooter` - sibling slots.
- `Header` - semantic `<header>` landmark component.
- `Banner` - prominent message bar across the top of a page.
- `SuperBanner` - high-priority system banner.
- `HamburgerMenu` - mobile navigation toggle.

---

Lily™ and Lily Design System™ are trademarks.
