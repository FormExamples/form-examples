<script lang="ts">
    // Avatar component
    //
    // A headless avatar container that displays a user's identity. Renders as
    // a <span role="img"> with an accessible label. The consumer provides
    // AvatarImage and/or AvatarText children to control the
    // avatar content. Commonly used in user profiles, comment threads,
    // contact lists, and messaging interfaces.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   alt — string, required. Accessible description of the person via aria-label.
    //   children — Snippet, required. AvatarImage and/or AvatarText elements.
    //   ...restProps — additional HTML attributes spread onto the outer <span>.
    //
    // Syntax:
    //   <Avatar alt="Jane Doe">...</Avatar>
    //
    // Examples:
    //   <!-- Image avatar -->
    //   <Avatar alt="Jane Doe">
    //     <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
    //   </Avatar>
    //
    //   <!-- Initials avatar -->
    //   <Avatar alt="Jane Doe">
    //     <AvatarText>JD</AvatarText>
    //   </Avatar>
    //
    //   <!-- Image with initials fallback -->
    //   <Avatar alt="Jane Doe">
    //     <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
    //     <AvatarText>JD</AvatarText>
    //   </Avatar>
    //
    // Keyboard: None — this is a display-only element, not interactive.
    //
    // Accessibility:
    //   - role="img" on the outer <span> for assistive technologies
    //   - aria-label provides the accessible name (the person's name)
    //
    // Internationalization:
    //   - alt comes through props
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Compound component — use with AvatarImage and AvatarText
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer provides border-radius: 50% for the circular shape
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        alt,
        children,
        ...restProps
    }: {
        /** Accessible description of the person. */
        alt: string;
        /** AvatarImage and/or AvatarText elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Avatar.svelte -->
<span
    class={`avatar ${className}`}
    role="img"
    aria-label={alt}
    {...restProps}
>
    {@render children?.()}
</span>
