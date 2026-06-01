<script lang="ts">
    // ClampText component
    //
    // A headless text container that truncates content to a maximum number of lines.
    // Sets a CSS custom property `--clamp-text-lines` and a `data-lines` attribute so
    // consumer CSS can apply `-webkit-line-clamp` or modern `line-clamp`. The full
    // text remains in the DOM and is accessible to assistive technology.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   lines — number, default 2. Maximum visible lines.
    //   label — string, optional. aria-label for screen readers.
    //   children — Snippet, required. The text content.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ClampText lines={3}>Long text here</ClampText>
    //
    // Examples:
    //   <ClampText lines={2} label="Article excerpt">
    //     {longText}
    //   </ClampText>
    //
    // Keyboard:
    //   - None (non-interactive content container)
    //
    // Accessibility:
    //   - aria-label optional for screen reader context
    //   - Full text remains in DOM (not visually hidden)
    //
    // Internationalization:
    //   - All text comes through children; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: only inline style is the CSS custom property `--clamp-text-lines`
    //   - Consumer applies the actual line-clamp CSS using the custom property
    //
    // References:
    //   - MDN line-clamp: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        lines = 2,
        label = undefined,
        children,
        ...restProps
    }: {
        /** Maximum visible lines */
        lines?: number;
        /** aria-label for screen readers */
        label?: string;
        /** Text content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ClampText.svelte -->
<div
    class={`clamp-text ${className}`}
    data-lines={lines}
    style={`--clamp-text-lines: ${lines};`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
