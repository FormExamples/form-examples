<script lang="ts">
    // PhaseBanner component
    //
    // A banner that states a service's phase (alpha or beta) and invites feedback. Renders a <div> with
    // the `phase-banner` hook around the consumer's tag and text.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The phase tag and message.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <PhaseBanner label="…">…</PhaseBanner>
    //
    // Examples:
    //   <PhaseBanner label="Service phase"><strong>Beta</strong> This is a new service.</PhaseBanner>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - A <div> has no role; pass role="region" or "group" through restProps so the label is announced
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - NHS UK design system: https://service-manual.nhs.uk/design-system

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

<!-- PhaseBanner.svelte -->
<div
    class={`phase-banner ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
