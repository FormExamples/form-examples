# SkipLink

A headless skip-navigation link that lets keyboard users bypass repeated content (global nav, page header) and jump directly to the main content area.

## What it is

A Svelte 5 headless primitive that renders a single `<a class="skip-link ...">` with an `href` target and visible link text.

## What it does

- Renders a native anchor with the provided `href` (default `"#content"`).
- Displays the `label` as the link text (default `"Skip to content"`).
- Spreads `...restProps` onto the `<a>` (including `class`, `style`, event handlers).

No visual styling is included; consumers typically hide the link until it receives focus.

## When to use it

- As the first focusable element on every page of the application.
- In any page or app shell that has repeated navigation above the main content.
- To satisfy WCAG Success Criterion 2.4.1 (Bypass Blocks).

## When not to use it

- Single-section pages with no repeated content above the main area.
- In-page jump links that are decorative; use `<a>` directly.
- Navigation that should always be visible; use `NavigationMenu` or `BreadcrumbNav`.

## How to use it

1. Import the component.
2. Place it as the very first focusable element inside `<body>` (typically inside a header or layout wrapper).
3. Ensure the target element (by default `#content`) exists on the page.
4. Provide a localized `label` if not English.
5. Use CSS to visually hide the link until focused.

## Props

- `class` (string, optional, default `""`) - merged with the base `skip-link` class.
- `href` (string, optional, default `"#content"`) - anchor target.
- `label` (string, optional, default `"Skip to content"`) - visible link text.
- `...restProps` - spread onto the `<a>`.

## Usage

Default usage:

```svelte
<script lang="ts">
    import SkipLink from "./SkipLink.svelte";
</script>

<SkipLink />
<main id="content">...</main>
```

Custom target and localized label:

```svelte
<script lang="ts">
    import SkipLink from "./SkipLink.svelte";
</script>

<SkipLink href="#main" label="Passer au contenu" />
<main id="main">...</main>
```

Custom class for focus styling:

```svelte
<script lang="ts">
    import SkipLink from "./SkipLink.svelte";
</script>

<SkipLink href="#content" label="Skip navigation" class="sr-only-focusable" />
```

Multiple targets:

```svelte
<script lang="ts">
    import SkipLink from "./SkipLink.svelte";
</script>

<nav aria-label="Skip links">
    <SkipLink href="#main" label="Skip to main" />
    <SkipLink href="#search" label="Skip to search" />
    <SkipLink href="#footer" label="Skip to footer" />
</nav>
```

Inside app shell:

```svelte
<script lang="ts">
    import SkipLink from "./SkipLink.svelte";
    import Header from "../Header/Header.svelte";
</script>

<SkipLink />
<Header label="Site header">...</Header>
<main id="content" tabindex="-1">Main content</main>
```

## Accessibility

- Satisfies WCAG 2.1 Bypass Blocks (2.4.1).
- The link text (`label` prop) is the accessible name.
- The link target element should either be a landmark (like `<main>`) or have `tabindex="-1"` so focus can land on it.
- Typically the element is visually hidden until it receives focus; consumers control that via CSS.

References:
- WCAG 2.1 Bypass Blocks: https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html
- WebAIM Skip Navigation Links: https://webaim.org/techniques/skipnav/

## Related components

- `Header`, `Footer` - landmark containers.
- `NavigationMenu` - primary site nav.
- `BreadcrumbNav` - secondary navigation.

---

Lily™ and Lily Design System™ are trademarks.
