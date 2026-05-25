<script lang="ts">
    // ScrollBar component
    //
    // A headless scrollbar track element that provides the ARIA scrollbar role
    // and value attributes for a custom scrollbar control. Renders a <div> with
    // orientation, value range, and accessible labeling. The consumer provides the
    // visual thumb element as children and implements drag/scroll interaction logic.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   orientation — "vertical" | "horizontal", default "vertical". The scrollbar direction.
    //   label — string, required. Accessible name for the scrollbar via aria-label.
    //   children — Snippet, required. ScrollBar content, typically the draggable thumb element.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ScrollBar orientation="vertical" label="Scroll">
    //     <div>thumb</div>
    //   </ScrollBar>
    //
    // Examples:
    //   <!-- Horizontal scrollbar for a timeline -->
    //   <ScrollBar orientation="horizontal" label="Timeline scroll">
    //     <div class="thumb"></div>
    //   </ScrollBar>
    //
    //   <!-- Vertical scrollbar with custom attributes -->
    //   <ScrollBar orientation="vertical" label="Page scroll" aria-valuenow={scrollPos}>
    //     <div class="thumb"></div>
    //   </ScrollBar>
    //
    // Keyboard:
    //   - Arrow Up/Left: scroll backward (decrease value) — consumer must implement
    //   - Arrow Down/Right: scroll forward (increase value) — consumer must implement
    //   - Page Up/Down: scroll by large increment — consumer must implement
    //   - Home: scroll to beginning — consumer must implement
    //   - End: scroll to end — consumer must implement
    //
    // Accessibility:
    //   - role="scrollbar" identifies the element as a scrollbar control
    //   - aria-orientation indicates horizontal or vertical direction
    //   - aria-valuenow/aria-valuemin/aria-valuemax track scroll position
    //   - aria-label provides the accessible name
    //
    // Internationalization:
    //   - The label prop externalizes the accessible label string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Initial value attributes (0/0/100) are defaults; consumer updates dynamically
    //   - Consumer implements all drag handling and position updates
    //
    // References:
    //   - WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        orientation = "vertical",
        label,
        children,
        ...restProps
    }: {
        /** ScrollBar orientation. */
        orientation?: "vertical" | "horizontal";
        /** Accessible label. */
        label: string;
        /** ScrollBar content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ScrollBar.svelte -->
<div
    class={`scroll-bar ${className}`}
    role="scrollbar"
    aria-label={label}
    aria-orientation={orientation}
    aria-valuenow={0}
    aria-valuemin={0}
    aria-valuemax={100}
    {...restProps}
>
    {@render children?.()}
</div>
