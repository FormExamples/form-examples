<script lang="ts">
    // ToggleButton component
    //
    // A headless toggle button: a native <button> with aria-pressed, the WAI-ARIA
    // toggle button pattern. Supports click and
    // keyboard (Space key) interaction. The pressed state is bindable for
    // two-way data flow. For actions that stay on, such as Bold, Mute or
    // Favourite; for a setting that turns on or off, use SwitchButton (role="switch").
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   pressed — boolean, default false. Whether the toggle is on. Bindable.
    //   disabled — boolean, default false. Whether the toggle is disabled.
    //   children — Snippet, optional. Button content.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <ToggleButton label="Dark mode" bind:pressed />
    //
    // Examples:
    //   <!-- Dark mode toggle -->
    //   <ToggleButton label="Dark mode" bind:pressed />
    //
    //   <!-- Mute toggle with disabled state -->
    //   <ToggleButton label="Mute audio" bind:pressed={muted} disabled={locked} />
    //
    // Keyboard:
    //   - Space: toggles between on and off states
    //   - Enter: activates the button (native button behavior)
    //
    // Accessibility:
    //   - A native <button>: no role is needed; a screen reader says "toggle button"
    //   - aria-pressed={pressed} communicates the current state ("pressed" / "not pressed")
    //   - aria-label={label} provides the accessible name
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable() for two-way data binding on pressed
    //   - type="button" prevents accidental form submission
    //
    // References:
    //   - WAI-ARIA Button Pattern (toggle button): https://www.w3.org/WAI/ARIA/apg/patterns/button/
    //   - aria-pressed: https://www.w3.org/TR/wai-aria-1.2/#aria-pressed

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        pressed = $bindable(false),
        disabled = false,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Whether the toggle is on. Bindable. */
        pressed?: boolean;
        /** Whether the toggle is disabled. */
        disabled?: boolean;
        /** Optional button content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    function onclick() {
        if (!disabled) {
            pressed = !pressed;
        }
    }

    function onkeydown(event: KeyboardEvent) {
        if (event.key === " ") {
            event.preventDefault();
            if (!disabled) {
                pressed = !pressed;
            }
        }
    }
</script>

<!-- ToggleButton.svelte -->
<button
    class={`toggle-button ${className}`}
    type="button"
    aria-pressed={pressed}
    aria-label={label}
    {disabled}
    {onclick}
    {onkeydown}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</button>
