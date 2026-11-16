<script lang="ts">
    // SharePage component
    //
    // A group of controls for sharing the current page. Renders a <div role="group"> with the `share-page`
    // hook; the links or buttons are the consumer's (see share-picker for a complete interaction).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The sharing links or buttons.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <SharePage label="…">…</SharePage>
    //
    // Examples:
    //   <SharePage label="Share this page"><a href="…">Email</a></SharePage>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - role="group" with aria-label names the controls
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
    import { warnMissingName } from "../dev-warning";

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("SharePage", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );
</script>

<!-- SharePage.svelte -->
<div
    class={`share-page ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
