# HamburgerMenu

A hamburger menu toggle button paired with a navigation panel. Used on mobile and compact layouts to conserve screen space by hiding the primary navigation behind a toggle control.

## What it is

A Svelte 5 component that renders a wrapper `<div>` containing a `<button>` and (when open) a `<div role="navigation">` landmark. The button manages `aria-expanded` and `aria-controls` linking to the panel, and the `open` prop is bindable via `$bindable(false)`.

## What it does

- Renders a wrapper `<div class="hamburger-menu ...">`.
- Renders `<button type="button" aria-label aria-expanded aria-controls>` that toggles `open` on click and displays the `label` as its visible text.
- Generates a unique `menuId` via `Math.random().toString(36)` for `aria-controls` and the panel's `id`.
- When `open` is true, renders `<div id={menuId} role="navigation" aria-label>` containing the `children` snippet.
- When `open` is false, the navigation panel is fully removed from the DOM.

## When to use it

- Mobile-first navigation where the primary menu is collapsed behind a toggle.
- Any compact UI where navigation should be hidden until requested.

## When not to use it

- For desktop navigation that should always be visible. Use `NavigationMenu` or `MenuBar`.
- For a dropdown menu triggered by a button. Use `DropdownMenu`.
- For a side-sliding panel. Use `Drawer`, `Sheet`, or `SlideOutDrawer`.
- For accordion-style navigation. Use `AccordionNav`.

## How to use it

Import the component, optionally bind `open` to consumer state, and supply the navigation markup as children. The visible button text is the `label`; consumer CSS can replace/hide the text with an icon.

## Props

- `class` (string, optional) - CSS class appended after the base `hamburger-menu` class.
- `label` (string, default `"Menu"`) - Accessible name for the toggle button and navigation panel. Also rendered as the button's visible text.
- `open` (boolean, default `false`) - Whether the navigation panel is visible. Bindable via `bind:open`.
- `children` (Snippet, required) - Navigation content rendered when the menu is open.
- `...restProps` - Additional HTML attributes spread onto the wrapper `<div>`.

## Usage

```svelte
<script lang="ts">
    import HamburgerMenu from "./HamburgerMenu.svelte";
    let open = $state(false);
</script>

<HamburgerMenu label="Main menu" bind:open>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</HamburgerMenu>
```

```svelte
<script lang="ts">
    import HamburgerMenu from "./HamburgerMenu.svelte";
    let menuOpen = $state(true);
</script>

<HamburgerMenu bind:open={menuOpen}>
    <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/settings">Settings</a></li>
    </ul>
</HamburgerMenu>
<p>Menu is {menuOpen ? "open" : "closed"}</p>
```

```svelte
<script lang="ts">
    import HamburgerMenu from "./HamburgerMenu.svelte";
    const links = [
        { href: "/", text: "Home" },
        { href: "/pricing", text: "Pricing" },
        { href: "/docs", text: "Docs" },
    ];
</script>

<HamburgerMenu label="Site menu">
    <nav>
        <ul>
            {#each links as l}<li><a href={l.href}>{l.text}</a></li>{/each}
        </ul>
    </nav>
</HamburgerMenu>
```

```svelte
<script lang="ts">
    import HamburgerMenu from "./HamburgerMenu.svelte";
    let open = $state(false);
    function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") open = false;
    }
</script>

<svelte:window on:keydown={onKey} />
<HamburgerMenu label="Menu" bind:open>
    <p>Press Escape to close.</p>
</HamburgerMenu>
```

```svelte
<script lang="ts">
    import HamburgerMenu from "./HamburgerMenu.svelte";
</script>

<HamburgerMenu
    label="Navigation"
    class="mobile-menu"
    data-testid="mobile-menu"
>
    <ul>
        <li><a href="/">Home</a></li>
    </ul>
</HamburgerMenu>
```

## Accessibility

- `aria-label` on the button names the control.
- `aria-expanded` on the button reflects panel visibility.
- `aria-controls` links the button to the panel's `id`.
- `role="navigation"` + `aria-label` on the panel creates a named navigation landmark.
- Native `<button>` supports Enter and Space for toggling.
- When closed, the panel is removed from the DOM, so it cannot be reached via Tab.
- Consumer is responsible for focus management when opening/closing (e.g. returning focus to the button on Escape).

## Related components

- `NavigationMenu` - site-wide persistent navigation menu.
- `DropdownMenu` - menu that opens below a trigger button.
- `Menu` / `MenuItem` - generic menu and items.
- `Drawer` / `Sheet` / `SlideOutDrawer` - edge-anchored navigation panels.
- `AccordionNav` - hierarchical accordion navigation.

---

Lily™ and Lily Design System™ are trademarks.
