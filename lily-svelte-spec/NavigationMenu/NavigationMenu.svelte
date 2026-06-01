<script lang="ts">
    // NavigationMenu component
    //
    // A headless navigation menu that provides a semantic <nav> landmark with an
    // accessible label for site-wide or section-level navigation. It enables screen
    // reader users to quickly locate and jump to the navigation area using landmark
    // navigation. Suitable for primary navigation bars, sidebar navigation, footer
    // navigation, and any grouped set of navigation links.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label to distinguish this nav landmark.
    //   children — Snippet, required. Navigation content (links, lists, nested menus).
    //   ...restProps — additional HTML attributes spread onto the <nav>.
    //
    // Syntax:
    //   <NavigationMenu label="Main navigation">
    //     <a href="/">Home</a>
    //   </NavigationMenu>
    //
    // Examples:
    //   <!-- Primary navigation -->
    //   <NavigationMenu label="Main navigation">
    //     <a href="/">Home</a>
    //     <a href="/about">About</a>
    //   </NavigationMenu>
    //
    //   <!-- Footer navigation with list structure -->
    //   <NavigationMenu label="Footer navigation">
    //     <ul>
    //       <li><a href="/privacy">Privacy Policy</a></li>
    //       <li><a href="/terms">Terms of Service</a></li>
    //     </ul>
    //   </NavigationMenu>
    //
    // Keyboard:
    //   - None — this is a passive container. Navigation links inside use standard
    //     Tab key focus and Enter/Space activation provided by the browser.
    //
    // Accessibility:
    //   - <nav> element implicitly has role="navigation", making it a navigation landmark
    //   - aria-label distinguishes this navigation from other <nav> landmarks on the page
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All navigation content comes through the children snippet
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal state or keyboard handling; relies on native link behavior
    //
    // References:
    //   - WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation
    //   - WAI-ARIA Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Navigation content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- NavigationMenu.svelte -->
<nav
    class={`navigation-menu ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</nav>
