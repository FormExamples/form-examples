<script lang="ts">
    // SuccessPanel component
    //
    // A confirmation panel shown after an action succeeds. Renders a <div role="status"> with the
    // `success-panel` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The confirmation heading and text.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <SuccessPanel label="…">…</SuccessPanel>
    //
    // Examples:
    //   <SuccessPanel label="Saved"><h2>Saved</h2><p>Your changes were saved.</p></SuccessPanel>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - role="status" is a polite live region: text inserted into it after load is announced
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Do not rely on colour alone to show success (WCAG 1.4.1); include a heading or text
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

<!-- SuccessPanel.svelte -->
<div
    class={`success-panel ${className}`}
    role="status"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
