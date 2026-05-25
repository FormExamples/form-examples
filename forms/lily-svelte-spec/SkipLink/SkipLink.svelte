<script lang="ts">
    // SkipLink component
    //
    // A headless skip navigation link that allows keyboard users to bypass
    // repetitive content (navigation menus, headers) and jump directly to the main
    // content area. Should be the very first focusable element on a page. Typically
    // styled to be visually hidden until focused, then positioned prominently.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   href — string, default "#content". The anchor target that the link navigates to.
    //   label — string, default "Skip to content". The visible link text.
    //   ...restProps — additional HTML attributes spread onto the <a>.
    //
    // Syntax:
    //   <SkipLink />
    //
    // Examples:
    //   <!-- Custom target and label -->
    //   <SkipLink href="#main" label="Skip to main content" />
    //
    //   <!-- With custom class for focus styling -->
    //   <SkipLink href="#content" label="Skip navigation" class="sr-only-focusable" />
    //
    // Keyboard:
    //   - Tab: moves focus to the skip link (should be the first focusable element)
    //   - Enter: activates the link, moving focus to the target anchor element
    //
    // Accessibility:
    //   - Native <a> element with href is natively accessible as a link
    //   - The link text content (label prop) serves as the accessible name
    //   - No additional ARIA attributes needed
    //   - WCAG 2.1 Success Criterion 2.4.1: Bypass Blocks
    //
    // Internationalization:
    //   - The label prop externalizes the link text for localization
    //   - Default "Skip to content" should be overridden in non-English contexts
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer must ensure the target element exists with a matching id attribute
    //   - Typically styled as visually hidden until :focus
    //
    // References:
    //   - WCAG 2.1 Bypass Blocks: https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html
    //   - WebAIM Skip Navigation Links: https://webaim.org/techniques/skipnav/

    let {
        class: className = "",
        href = "#content",
        label = "Skip to content",
        ...restProps
    }: {
        /** Target anchor. */
        href?: string;
        /** Link text. */
        label?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SkipLink.svelte -->
<a
    class={`skip-link ${className}`}
    {href}
    {...restProps}>{label}</a
>
