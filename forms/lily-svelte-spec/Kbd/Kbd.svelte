<script lang="ts">
    // Kbd component
    //
    // Marks keyboard input, such as a key or shortcut. Renders a <kbd> with the `kbd` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Spoken form, read instead of the visible key.
    //   children — Snippet, required. The key text, for example Ctrl.
    //   ...restProps — additional HTML attributes spread onto the root <kbd>.
    //
    // Syntax:
    //   <Kbd label="…">…</Kbd>
    //
    // Examples:
    //   <p>Press <Kbd>Esc</Kbd> to close.</p>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - hidden text comes from `label` when given
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <kbd>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

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

<!-- Kbd.svelte -->
<kbd
    class={`kbd ${className}`}
    {...restProps}
>
    {#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}<span
        class="kbd-text"
        aria-hidden={label ? "true" : undefined}>{@render children?.()}</span
    >
</kbd>
