<script lang="ts">
    // Character component
    //
    // A headless component for displaying a single character, glyph, symbol, or
    // emoji with proper accessibility semantics. When the character conveys meaning
    // (like a checkmark for success), it uses role="img" with aria-label. When
    // purely decorative, it hides from assistive technologies. Useful for initials,
    // status indicators, rating symbols, and decorative flourishes.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible description of the character for screen readers.
    //   decorative — boolean, default false. When true, hides the character from assistive technology.
    //   children — Snippet, required. The character to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <Character label="Check mark">✓</Character>
    //
    // Examples:
    //   <!-- Meaningful character with accessible label -->
    //   <Character label="Warning symbol">⚠</Character>
    //
    //   <!-- Decorative character hidden from screen readers -->
    //   <Character decorative>★</Character>
    //
    // Keyboard:
    //   None — this component is a passive display element.
    //
    // Accessibility:
    //   - role="img" when the character is meaningful (decorative is false)
    //   - role="presentation" when decorative is true, removing semantic meaning
    //   - aria-label provides the accessible name for meaningful characters
    //   - aria-hidden="true" when decorative, hiding from the accessibility tree
    //
    // Internationalization:
    //   - Label text comes through the label prop; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Always provide a label when the character conveys meaning
    //   - Use decorative=true for purely visual characters
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

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

<!-- Character.svelte -->
<span
    class={`character ${className}`}
    role={decorative ? "presentation" : "img"}
    aria-label={decorative ? undefined : label}
    aria-hidden={decorative ? "true" : undefined}
    {...restProps}
>
    {@render children?.()}
</span>
