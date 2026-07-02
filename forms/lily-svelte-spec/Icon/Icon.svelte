<script lang="ts">
    // Icon component
    //
    // An icon wrapper that provides proper accessibility semantics for icon content.
    // Supports both meaningful icons (with accessible labels announced by screen readers)
    // and decorative icons (hidden from assistive technology). The consumer provides the
    // actual icon content (text characters, SVG, or any markup) as children.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, default undefined. Accessible name for meaningful icons via aria-label.
    //   decorative — boolean, default false. When true, hides the icon from assistive technology.
    //   children — Snippet, required. The icon content (text, SVG, or other markup).
    //   ...restProps — additional HTML attributes spread onto the span element.
    //
    // Syntax:
    //   <Icon label="Close">x</Icon>
    //
    // Examples:
    //   <!-- Meaningful icon with accessible label -->
    //   <Icon label="Close">x</Icon>
    //
    //   <!-- Decorative icon hidden from screen readers -->
    //   <Icon decorative>*</Icon>
    //
    //   <!-- Icon with custom data attribute -->
    //   <Icon label="Search" data-testid="search-icon">Q</Icon>
    //
    // Keyboard:
    //   - None — this is a passive container; keyboard behavior depends on the parent interactive element
    //
    // Accessibility:
    //   - role="img" applied to meaningful icons so assistive technology treats the span as an image
    //   - aria-label provides the accessible name for meaningful icons
    //   - aria-hidden="true" applied when decorative is true, hiding the icon from the accessibility tree
    //   - When decorative is true, role is omitted entirely
    //
    // Internationalization:
    //   - The label prop allows localized accessible names; no hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer provides the icon content; this component only handles semantics
    //   - Mutually exclusive modes: meaningful (label) vs decorative (aria-hidden)
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
    //   - WAI-ARIA Images Tutorial: https://www.w3.org/WAI/tutorials/images/decorative/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        decorative = false,
        children,
        ...restProps
    }: {
        label?: string;
        decorative?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Icon.svelte -->
<span
    class={`icon ${className}`}
    role={decorative ? undefined : "img"}
    aria-label={label}
    aria-hidden={decorative || undefined}
    {...restProps}
>
    {@render children?.()}
</span>
