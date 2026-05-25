# NavigationMenu

NavigationMenu is a headless Svelte 5 component that provides a semantic `<nav>` landmark with an accessible label for site-wide or section-level navigation. It enables screen-reader users to quickly locate and jump to the navigation area using landmark navigation.

## What it is

A thin wrapper around the HTML `<nav>` element. Because `<nav>` implicitly has `role="navigation"`, no explicit role is needed. The `aria-label` prop distinguishes multiple `<nav>` landmarks on a page.

## What it does

- Renders a `<nav>` with `class="navigation-menu"` plus any consumer-provided CSS class.
- Applies `aria-label` from the required `label` prop.
- Renders the required `children` snippet as navigation content (links, lists, nested menus).
- Spreads `...restProps` onto the `<nav>`.

## When to use it

- Primary navigation bars.
- Sidebar navigation.
- Footer navigation (privacy, terms, contact).
- Section-level in-page navigation.
- Any grouped set of navigation links that warrants a landmark.

## When not to use it

- Do not use for menus of actions — use `Menu` or `MenuBar`.
- Do not use for a breadcrumb — use `BreadcrumbNav`.
- Do not use for a pagination list — use `PaginationNav`.
- Do not use for a tree-style expandable navigation — use `TreeNav`.
- Do not use for table-of-contents navigation — use `ContentsNav`.

## How to use it

Wrap navigation content in `NavigationMenu`, pass a descriptive `label`, and include `<a>`, lists, or nested components.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `navigation-menu` class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `children` (Snippet, required) — navigation content (links, lists, nested menus).
- `...restProps` (unknown) — additional HTML attributes spread onto the `<nav>`.

## Usage

### Primary navigation

```svelte
<script lang="ts">
    import NavigationMenu from "./NavigationMenu.svelte";
</script>

<NavigationMenu label="Main navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</NavigationMenu>
```

### Footer navigation with a list

```svelte
<script lang="ts">
    import NavigationMenu from "./NavigationMenu.svelte";
</script>

<NavigationMenu label="Footer navigation">
    <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</NavigationMenu>
```

### Sidebar navigation with current page marking

```svelte
<script lang="ts">
    import NavigationMenu from "./NavigationMenu.svelte";
    let current = $state("/dashboard");
</script>

<NavigationMenu label="Sidebar">
    <a href="/dashboard" aria-current={current === "/dashboard" ? "page" : undefined}>
        Dashboard
    </a>
    <a href="/reports" aria-current={current === "/reports" ? "page" : undefined}>
        Reports
    </a>
    <a href="/settings" aria-current={current === "/settings" ? "page" : undefined}>
        Settings
    </a>
</NavigationMenu>
```

### Dynamic navigation from state

```svelte
<script lang="ts">
    import NavigationMenu from "./NavigationMenu.svelte";
    let links = [
        { href: "/", label: "Home" },
        { href: "/news", label: "News" },
        { href: "/about", label: "About" },
    ];
</script>

<NavigationMenu label="Main navigation">
    <ul>
        {#each links as link}
            <li><a href={link.href}>{link.label}</a></li>
        {/each}
    </ul>
</NavigationMenu>
```

### Navigation with consumer CSS

```svelte
<script lang="ts">
    import NavigationMenu from "./NavigationMenu.svelte";
</script>

<NavigationMenu class="site-nav" label="Main">
    <a href="/">Home</a>
    <a href="/blog">Blog</a>
</NavigationMenu>

<style>
    :global(.site-nav) {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }
</style>
```

## Accessibility

- `<nav>` implicitly has `role="navigation"`, making it a navigation landmark.
- `aria-label` distinguishes this navigation from other `<nav>` landmarks on the page.
- Use `aria-current="page"` on the link that points to the current page.
- No keyboard handling needed — links use native browser Tab / Enter / Space behaviour.
- Compliant with WAI-ARIA Navigation landmark and WCAG 2.2 AAA with consumer-provided focus indicators.

## Related components

- `BreadcrumbNav` / `BreadcrumbList` / `BreadcrumbListItem` — breadcrumb trail.
- `PaginationNav` / `PaginationList` / `PaginationListItem` — paginated links.
- `TreeNav` / `TreeList` / `TreeListItem` — hierarchical navigation.
- `ContentsNav` / `ContentsList` / `ContentsListItem` — table-of-contents navigation.
- `AccordionNav` / `AccordionList` / `AccordionListItem` — collapsible navigation sections.
- `Sidebar` — a side panel for navigation or supplementary content.
- `HamburgerMenu` — a toggle button that opens a mobile navigation menu.
