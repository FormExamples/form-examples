<script lang="ts">
    // Loading component
    //
    // An indicator that content is loading. Renders a <div> with the `loading` hook; the spinner or text
    // inside is the consumer's.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The visual indicator or text.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Loading label="…">…</Loading>
    //
    // Examples:
    //   <Loading label="Loading results"><span class="spinner" /></Loading>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - This component does not render role="status" or aria-live; pass role="status" through restProps so the change is announced politely
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

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

<!-- Loading.svelte -->
<div
    class={`loading ${className}`}
    role="status"
    aria-live="polite"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
