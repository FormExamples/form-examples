<script lang="ts">
    // StickyPromoBanner component
    //
    // A fixed-position promotional banner with an optional dismiss button.
    // Renders an <aside role="complementary"> pinned to the top or bottom of
    // the viewport via the documented inline `position: fixed` styles. The
    // dismiss button is rendered only when an `ondismiss` handler is provided.
    //
    // Inline styles are intentional and limited to what is required for the
    // component to function (sticky positioning).
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the aside region.
    //   open — boolean, default true. Whether the banner is visible.
    //   position — "top" | "bottom", default "bottom". Sticky edge.
    //   dismissLabel — string, REQUIRED. aria-label for the dismiss button.
    //   ondismiss — (event: MouseEvent) => void, optional. Dismiss handler.
    //   children — Snippet, optional. Banner content.
    //   ...restProps — additional HTML attributes spread onto the <aside>.
    //
    // Syntax:
    //   <StickyPromoBanner label="Promo" dismissLabel="Dismiss" ondismiss={fn}>
    //     {#snippet children()}<p>Special offer.</p>{/snippet}
    //   </StickyPromoBanner>
    //
    // Accessibility:
    //   - <aside role="complementary"> with aria-label
    //   - Dismiss button has aria-label
    //
    // Internationalization:
    //   - All text content via props
    //
    // Claude rules:
    //   - Headless: no styles EXCEPT documented inline position styles
    //   - label and dismissLabel are REQUIRED — TypeScript reflects this
    //   - Dismiss button rendered only when ondismiss is provided

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        open = true,
        position = "bottom",
        dismissLabel,
        ondismiss = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Consumer CSS class appended to base class */
        class?: string;
        /** aria-label for the aside region (REQUIRED) */
        label: string;
        /** Whether the banner is visible */
        open?: boolean;
        /** Sticky edge of the viewport */
        position?: "top" | "bottom";
        /** aria-label for the dismiss button (REQUIRED) */
        dismissLabel: string;
        /** Dismiss click handler */
        ondismiss?: (event: MouseEvent) => void;
        /** Banner content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    let edgeStyle = $derived(position === "top" ? "top: 0;" : "bottom: 0;");
    let stickyStyle = $derived(`position: fixed; left: 0; right: 0; ${edgeStyle}`);
</script>

<!-- StickyPromoBanner.svelte -->
<aside
    class={`sticky-promo-banner ${className}`}
    role="complementary"
    aria-label={label}
    data-position={position}
    hidden={!open}
    style={stickyStyle}
    {...restProps}
>
    <div class="sticky-promo-banner-content">
        {#if children}{@render children?.()}{/if}
    </div>
    {#if ondismiss}
        <button
            type="button"
            class="sticky-promo-banner-dismiss"
            aria-label={dismissLabel}
            onclick={ondismiss}
        >
            ×
        </button>
    {/if}
</aside>
