<script lang="ts">
    // FloatButton component
    //
    // A floating action button anchored to a viewport corner. Renders a native
    // <button> with `position: fixed` and corner offsets via inline styles. The
    // `data-position` attribute exposes the corner so consumer CSS can refine
    // styling.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the button.
    //   position — "top-left" | "top-right" | "bottom-left" | "bottom-right",
    //              default "bottom-right". Viewport corner anchor.
    //   disabled — boolean, default false.
    //   type — "button" | "submit" | "reset", default "button".
    //   onclick — (event: MouseEvent) => void, optional. Click handler.
    //   children — Snippet, required. Icon content.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <FloatButton label="Help" onclick={openHelp}>?</FloatButton>
    //
    // Accessibility:
    //   - Native <button> with aria-label.
    //
    // Internationalization:
    //   - label comes through props.
    //
    // Claude rules:
    //   - Headless: inline `position: fixed` style is documented behavior.
    //   - label is REQUIRED — TypeScript reflects this.
    //
    // References:
    //   - Ant Design FloatButton: https://ant.design/components/float-button
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    import type { Snippet } from "svelte";

    type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

    let {
        class: className = "",
        label,
        position = "bottom-right",
        disabled = false,
        type = "button",
        onclick = undefined,
        children,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Accessible label (REQUIRED) */
        label: string;
        /** Viewport corner anchor */
        position?: Position;
        /** Whether the button is disabled */
        disabled?: boolean;
        /** HTML button type */
        type?: "button" | "submit" | "reset";
        /** Click handler */
        onclick?: (event: MouseEvent) => void;
        /** Icon content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const positionStyle = $derived.by(() => {
        switch (position) {
            case "top-left":
                return "position: fixed; top: 1rem; left: 1rem;";
            case "top-right":
                return "position: fixed; top: 1rem; right: 1rem;";
            case "bottom-left":
                return "position: fixed; bottom: 1rem; left: 1rem;";
            case "bottom-right":
            default:
                return "position: fixed; bottom: 1rem; right: 1rem;";
        }
    });
</script>

<!-- FloatButton.svelte -->
<button
    class={`float-button ${className}`}
    {type}
    {disabled}
    aria-label={label}
    data-position={position}
    style={positionStyle}
    {onclick}
    {...restProps}
>
    {@render children?.()}
</button>
