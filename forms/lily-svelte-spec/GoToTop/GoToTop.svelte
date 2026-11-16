<script lang="ts">
    // GoToTop component
    //
    // A link back to the top of the page. Renders an <a> with the `go-to-top` hook; `href` defaults to
    // #top, so the page needs an element with id="top" (or the consumer passes another target).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name, on aria-label; keep the visible text in it (WCAG 2.5.3).
    //   href — string, default "#top". The link target.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <a>.
    //
    // Syntax:
    //   <GoToTop>…</GoToTop>
    //
    // Examples:
    //   <GoToTop href="#top">Back to top</GoToTop>
    //
    // Keyboard:
    //   - Tab: moves focus onto the link
    //   - Enter: follows the link (native browser behaviour)
    //
    // Accessibility:
    //   - A native <a href>; the children are the accessible name
    //   - aria-label replaces the link text as the name, so it must contain that text
    //
    // Internationalization:
    //   - The link text is the consumer's children; no hardcoded text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
    import { warnMissingName } from "../dev-warning";

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        href = "#top",
        children,
        ...restProps
    }: {
        label: string;
        href?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("GoToTop", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );
</script>

<!-- GoToTop.svelte -->
<a
    class={`go-to-top ${className}`}
    {href}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</a>
