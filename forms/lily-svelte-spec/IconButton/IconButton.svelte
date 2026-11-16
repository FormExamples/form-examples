<script lang="ts">
    // IconButton component
    //
    // A headless button containing only an icon with a REQUIRED accessible label.
    // Renders a native `<button>` so keyboard support, focus, and the button role
    // come for free. The `label` prop is mandatory because icon-only buttons must
    // expose an accessible name to assistive technology.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   baseClass — string, default "icon-button". The base class token itself
    //     (not appended — replaces "icon-button" outright). A consumer that owns
    //     its own exact class-hook contract (e.g. a picker component whose spec
    //     requires `class="{helper}-button"` with no extra "icon-button" token)
    //     sets this instead of layering on top of the default.
    //   label — string, REQUIRED. aria-label for screen readers.
    //   type — "button" | "submit" | "reset", default "button".
    //   disabled — boolean, default false.
    //   pressed — boolean | undefined, default undefined. Toggle button state.
    //   onclick — (event: MouseEvent) => void, optional. Click handler.
    //   ref — HTMLButtonElement | undefined, bindable. The rendered button, for
    //     a consumer that needs to call .focus() on it.
    //   children — Snippet, required. The icon content (svg, glyph, emoji).
    //   ...restProps — additional HTML attributes spread onto the <button>
    //     (e.g. aria-haspopup, aria-expanded, aria-controls, onkeydown).
    //
    // Syntax:
    //   <IconButton label="Close" onclick={handleClose}>×</IconButton>
    //
    // Examples:
    //   <IconButton label="Toggle dark mode" pressed={isDark} onclick={toggle}>🌙</IconButton>
    //
    // Keyboard:
    //   - Tab: Focus the button
    //   - Enter / Space: Activate
    //
    // Accessibility:
    //   - aria-label is the entire accessible name
    //   - aria-pressed is rendered only when pressed is provided
    //   - Native disabled attribute prevents activation
    //
    // Internationalization:
    //   - Label and content come through props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - label is REQUIRED — TypeScript reflects this
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    import type { Snippet } from "svelte";

    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        baseClass = "icon-button",
        label,
        type = "button",
        disabled = false,
        pressed = undefined,
        onclick = undefined,
        ref = $bindable<HTMLButtonElement | undefined>(undefined),
        children,
        ...restProps
    }: {
        /** Base class token, replacing "icon-button" outright (not appended). */
        baseClass?: string;
        /** Accessible label (REQUIRED for icon-only buttons) */
        label: string;
        /** HTML button type */
        type?: "button" | "submit" | "reset";
        /** Whether the button is disabled */
        disabled?: boolean;
        /** Toggle button pressed state */
        pressed?: boolean;
        /** Click handler */
        onclick?: (event: MouseEvent) => void;
        /** The rendered button element. Bindable. */
        ref?: HTMLButtonElement;
        /** Icon content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => warnMissingName("IconButton", label, restProps["aria-labelledby"]));
</script>

<!-- IconButton.svelte -->
<button
    class={`${baseClass} ${className}`}
    {type}
    {disabled}
    aria-label={label}
    aria-pressed={pressed}
    {onclick}
    bind:this={ref}
    {...restProps}
>
    {@render children?.()}
</button>
