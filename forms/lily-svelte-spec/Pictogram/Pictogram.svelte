<script lang="ts">
    // Pictogram component
    //
    // An icon-based component pairing an icon with a title and description in
    // a centered or side layout. Renders a native <figure> with the icon
    // marked aria-hidden (decorative) and content inside <figcaption>.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   layout — "centered" | "side", default "centered". Icon position.
    //   heading — string, optional. Title text.
    //   description — string, optional. Body text.
    //   icon — Snippet, REQUIRED. The icon/illustration content.
    //   label — string, optional. aria-label override.
    //   children — Snippet, optional. Additional content (overrides description).
    //   ...restProps — additional HTML attributes spread onto the <figure>.
    //
    // Syntax:
    //   <Pictogram heading="Privacy" description="Your data stays yours.">
    //     {#snippet icon()}<svg>…</svg>{/snippet}
    //   </Pictogram>
    //
    // Accessibility:
    //   - figure semantics
    //   - icon container is aria-hidden (decorative)
    //   - accessible name comes from heading or label
    //
    // Internationalization:
    //   - All text via props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - icon is REQUIRED Snippet, NOT children
    //
    // References:
    //   - HTML <figure>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        layout = "centered",
        heading = undefined,
        description = undefined,
        icon,
        label = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Consumer CSS class appended to base class */
        class?: string;
        /** Icon position relative to content */
        layout?: "centered" | "side";
        /** Title text */
        heading?: string;
        /** Body text */
        description?: string;
        /** Icon/illustration content (REQUIRED) */
        icon: Snippet;
        /** aria-label override */
        label?: string;
        /** Additional content (overrides description if provided) */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Pictogram.svelte -->
<figure
    class={`pictogram ${className}`}
    data-layout={layout}
    aria-label={label}
    {...restProps}
>
    <div class="pictogram-icon" aria-hidden="true">
        {@render icon()}
    </div>
    <figcaption class="pictogram-caption">
        {#if heading}
            <h3 class="pictogram-heading">{heading}</h3>
        {/if}
        {#if children}
            {@render children?.()}
        {:else if description}
            <p class="pictogram-description">{description}</p>
        {/if}
    </figcaption>
</figure>
