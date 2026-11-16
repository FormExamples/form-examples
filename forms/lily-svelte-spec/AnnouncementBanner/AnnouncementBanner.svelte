<script lang="ts">
    // AnnouncementBanner component
    //
    // A banner announcing news or a service notice. Renders a <div role="region"> with the `announcement-
    // banner` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The announcement.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <AnnouncementBanner label="…">…</AnnouncementBanner>
    //
    // Examples:
    //   <AnnouncementBanner label="Service notice">The service is closed on Monday.</AnnouncementBanner>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - role="region" with aria-label makes it a landmark; pass `label`, since a region without a name is not exposed as one
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AnnouncementBanner.svelte -->
<div
    class={`announcement-banner ${className}`}
    role="region"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
