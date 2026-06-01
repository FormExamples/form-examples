<script lang="ts">
    // ButtonInput component
    //
    // A headless component wrapping the native HTML <input type="button"> element.
    // Unlike the Button component which uses <button> and can contain rich content
    // via children snippets, this component displays its label as the value attribute
    // (plain text only). Useful in form contexts where native input semantics are preferred.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, required. The button label text displayed on the input.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   name — string, optional. Form field name for form submission.
    //   label — string, optional. Accessible label override via aria-label for screen readers.
    //   onclick — (event: MouseEvent) => void, optional. Click event handler.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <ButtonInput value="Click me" onclick={handleClick} />
    //
    // Examples:
    //   <!-- Disabled button input -->
    //   <ButtonInput value="Submit" disabled />
    //
    //   <!-- Named button with accessible label override -->
    //   <ButtonInput value="Save" name="action" label="Save changes" />
    //
    // Keyboard:
    //   - Tab: Focus the button input
    //   - Enter: Activate the button (native behavior)
    //   - Space: Activate the button (native behavior)
    //
    // Accessibility:
    //   - Implicit button role from <input type="button">
    //   - aria-label provides optional screen reader text override
    //   - Native disabled attribute prevents clicks and signals aria-disabled
    //
    // Internationalization:
    //   - Button label comes through the value prop; no hardcoded strings
    //   - Label override comes through label prop
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Plain text only — use Button component for rich content (icons, formatted text)
    //
    // References:
    //   - MDN input type="button": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    let {
        class: className = "",
        value,
        disabled = false,
        name = undefined,
        label = undefined,
        onclick = undefined,
        ...restProps
    }: {
        /** The button label text */
        value: string;
        /** Whether the input is disabled */
        disabled?: boolean;
        /** Form field name */
        name?: string;
        /** Accessible label override for screen readers */
        label?: string;
        /** Click event handler */
        onclick?: (event: MouseEvent) => void;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ButtonInput.svelte -->
<input
    class={`button-input ${className}`}
    type="button"
    {value}
    {disabled}
    {name}
    aria-label={label}
    {onclick}
    {...restProps}
/>
