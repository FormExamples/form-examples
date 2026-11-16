<script lang="ts">
    // BreadcrumbLink component
    //
    // A link used for one step of a breadcrumb trail. Renders an <a> with the `breadcrumb-link` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   href — string, required. The URL to navigate to.
    //   label — string, optional. Overrides the accessible name (aria-label).
    //   children — Snippet, required. The link content.
    //   ...restProps — additional HTML attributes spread onto the root <a>.
    //
    // Syntax:
    //   <BreadcrumbLink href="…">…</BreadcrumbLink>
    //
    // Examples:
    //   <BreadcrumbLink href="/page">Page</BreadcrumbLink>
    //
    // Keyboard:
    //   - Tab: moves focus onto the link
    //   - Enter: follows the link (native browser behaviour)
    //
    // Accessibility:
    //   - A native <a href>
    //   - `label` becomes aria-label and replaces the visible text as the name; when used it must contain the visible text (WCAG 2.5.3 Label in Name)
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Client-side routing is the consumer's: pass an onclick through restProps
    //
    // References:
    //   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        href,
        label = undefined,
        children,
        ...restProps
    }: {
        /** The URL to navigate to. */
        href: string;
        /** Accessible label override for screen readers. */
        label?: string;
        /** The link content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- BreadcrumbLink.svelte -->
<a
    class={`breadcrumb-link ${className}`}
    {href}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</a>
