<script lang="ts">
    // AvatarText component
    //
    // The text/initials fallback within an Avatar. Renders a <span>
    // with aria-hidden="true" containing the initials or short text that
    // represents the user when no image is available. Must be used inside
    // an Avatar container.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. Initials or short text (e.g., "JD").
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AvatarText>JD</AvatarText>
    //
    // Examples:
    //   <!-- Initials fallback inside Avatar -->
    //   <Avatar alt="Jane Doe">
    //     <AvatarText>JD</AvatarText>
    //   </Avatar>
    //
    //   <!-- Alongside an image as fallback -->
    //   <Avatar alt="Jane Doe">
    //     <AvatarImage src="/photo.jpg" alt="Jane Doe" />
    //     <AvatarText>JD</AvatarText>
    //   </Avatar>
    //
    // Keyboard: None — display-only element.
    //
    // Accessibility:
    //   - aria-hidden="true" prevents duplicate announcements since the
    //     parent Avatar already has aria-label
    //
    // Internationalization:
    //   - All text comes through the children snippet
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Compound component — must be used inside an Avatar
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** Initials or short text. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AvatarText.svelte -->
<span
    class={`avatar-text ${className}`}
    aria-hidden="true"
    {...restProps}
>
    {@render children?.()}
</span>
