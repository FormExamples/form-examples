<script lang="ts">
    // HoverCard component
    //
    // A hover card that displays supplementary content when triggered, typically by a
    // hover or focus interaction on a trigger element. It conditionally renders a container
    // with role="tooltip" when the open prop is true. Useful for user profile previews,
    // link previews, contextual help, or any popover-style content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the hover card via aria-label.
    //   open — boolean, default false. Whether the hover card is visible; bindable with bind:open.
    //   children — Snippet, required. Content to display inside the hover card.
    //   ...restProps — additional HTML attributes spread onto the container div.
    //
    // Syntax:
    //   <HoverCard label="User info" bind:open>{children}</HoverCard>
    //
    // Examples:
    //   <!-- Hover card triggered by mouse/focus events on a button -->
    //   <button
    //     onmouseenter={() => open = true}
    //     onmouseleave={() => open = false}
    //     onfocus={() => open = true}
    //     onblur={() => open = false}
    //   >Hover me</button>
    //   <HoverCard label="User info" bind:open>
    //     <p>Profile details here</p>
    //   </HoverCard>
    //
    // Keyboard:
    //   - None at the component level — consumer manages focus-based visibility on the trigger element
    //
    // Accessibility:
    //   - role="tooltip" identifies the hover card as supplementary descriptive content
    //   - aria-label provides an accessible name describing the hover card content
    //   - Consumer should link the trigger to the tooltip via aria-describedby
    //
    // Internationalization:
    //   - The label prop allows localized accessible names; no hardcoded user-facing strings
    //   - All content comes through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling and positioning
    //   - Uses $bindable(false) for two-way binding on the open prop
    //   - Consumer is responsible for managing hover/focus events on the trigger element
    //   - Fully removed from DOM when closed via {#if open}
    //
    // References:
    //   - WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
    //   - WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        open = $bindable(false),
        children,
        ...restProps
    }: {
        label: string;
        open?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- HoverCard.svelte -->
{#if open}
    <div
        class={`hover-card ${className}`}
        role="tooltip"
        aria-label={label}
        {...restProps}
    >
        {@render children?.()}
    </div>
{/if}
