<script lang="ts">
    // EmojiCharacterPicker component
    //
    // A grid of selectable emoji characters for browsing and selecting emoji.
    // Renders a <div> with role="grid" and an accessible label. Commonly used
    // in messaging apps, social media, comment systems, and rich text editors.
    // The consumer provides grid content, selection logic, and category navigation.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the picker.
    //   children — Snippet, required. The grid content containing emoji characters.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <EmojiCharacterPicker label="Choose an emoji">
    //     <div role="row"><button role="gridcell">😀</button></div>
    //   </EmojiCharacterPicker>
    //
    // Examples:
    //   <!-- Emoji picker with row of characters -->
    //   <EmojiCharacterPicker label="Choose an emoji">
    //     <div role="row">
    //       <button role="gridcell">😀</button>
    //       <button role="gridcell">😂</button>
    //       <button role="gridcell">😍</button>
    //     </div>
    //   </EmojiCharacterPicker>
    //
    // Keyboard:
    //   - None built-in — consumer should implement grid keyboard navigation
    //     (arrow keys for cell movement, Enter/Space for selection)
    //
    // Accessibility:
    //   - role="grid" identifies the container as a grid widget for structured navigation
    //   - aria-label provides an accessible name for the picker
    //   - Consumer should provide role="row" and role="gridcell" on children
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //   - Emoji characters are locale-independent
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal state — purely a structural wrapper
    //   - Consumer implements selection behavior and category filtering
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: { label: string; children: Snippet; [key: string]: unknown } = $props();
</script>

<!-- EmojiCharacterPicker.svelte -->
<div
    class={`emoji-character-picker ${className}`}
    role="grid"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
