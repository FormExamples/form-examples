<script lang="ts">
    // Button component
    //
    // A headless button for triggering actions, built on the native HTML <button>
    // element for inherent accessibility and keyboard support. Supports action
    // buttons, submit/reset buttons, and toggle buttons via the pressed prop.
    // Commonly used for form submissions, dialogs, menus, and toolbar actions.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   type — "button" | "submit" | "reset", default "button". HTML button type.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   pressed — boolean | undefined, default undefined. Toggle button state; when provided, aria-pressed is rendered.
    //   label — string, optional. Accessible label override via aria-label.
    //   onclick — (event: MouseEvent) => void, optional. Click event handler.
    //   children — Snippet, required. The button content.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <Button onclick={handleClick}>Click me</Button>
    //
    // Examples:
    //   <!-- Submit button in a form -->
    //   <Button type="submit" disabled={isSubmitting}>Submit</Button>
    //
    //   <!-- Toggle button with pressed state -->
    //   <Button pressed={isBold} onclick={() => isBold = !isBold}>Bold</Button>
    //
    //   <!-- Button with accessible label override -->
    //   <Button label="Close dialog" onclick={handleClose}>X</Button>
    //
    // Keyboard:
    //   - Tab: Focus the button
    //   - Enter: Activate the button
    //   - Space: Activate the button
    //
    // Accessibility:
    //   - Implicit button role from <button> element
    //   - aria-pressed for toggle button state (only when pressed prop is provided)
    //   - aria-label for screen reader text override
    //   - Native disabled attribute prevents clicks and signals aria-disabled
    //
    // Internationalization:
    //   - Button text comes through children snippet; no hardcoded strings
    //   - Label override comes through label prop
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Defaults to type="button" to prevent accidental form submissions
    //   - aria-pressed is only rendered when pressed prop is explicitly provided
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        type = "button",
        disabled = false,
        pressed = undefined,
        label = undefined,
        onclick = undefined,
        children,
        ...restProps
    }: {
        /** HTML button type */
        type?: "button" | "submit" | "reset";
        /** Whether the button is disabled */
        disabled?: boolean;
        /** Toggle button pressed state (undefined = not a toggle button) */
        pressed?: boolean;
        /** Accessible label override */
        label?: string;
        /** Click event handler */
        onclick?: (event: MouseEvent) => void;
        /** The button content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Button.svelte -->
<button
    class={`button ${className}`}
    {type}
    {disabled}
    aria-pressed={pressed}
    aria-label={label}
    {onclick}
    {...restProps}
>
    {@render children?.()}
</button>
