<script lang="ts">
    // MenuGroup component
    //
    // A labeled section of menu items within a menu. Renders a `<div>` with
    // `role="group"` and an `aria-label`. A visible heading is rendered with
    // `aria-hidden="true"` because the aria-label conveys the section name to
    // assistive technology.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. Section heading text (also aria-label).
    //   children — Snippet, optional. Menu items.
    //
    // Syntax:
    //   <MenuGroup label="File">
    //       <MenuItem>Open…</MenuItem>
    //       <MenuItem>Save</MenuItem>
    //   </MenuGroup>
    //
    // Accessibility:
    //   - role="group" with aria-label
    //   - visible heading is aria-hidden so AT does not double-announce
    //
    // Internationalization:
    //   - All user-facing strings via props
    //
    // References:
    //   - Adobe Spectrum MenuGroup: https://spectrum.adobe.com/page/menu/
    //   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children = undefined,
        ...restProps
    }: {
        class?: string;
        /** Section heading text, also used as aria-label (REQUIRED) */
        label: string;
        /** Menu items */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- MenuGroup.svelte -->
<div
    class={`menu-group ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    <div class="menu-group-heading" aria-hidden="true">{label}</div>
    {#if children}
        {@render children?.()}
    {/if}
</div>
