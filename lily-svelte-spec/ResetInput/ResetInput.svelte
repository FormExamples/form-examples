<script lang="ts">
    // ResetInput component
    //
    // A headless form reset button using the native HTML <input type="reset">
    // element. When clicked within a form, it resets all sibling form fields to
    // their initial default values. Useful in forms where users may want to clear
    // all entered data and start over.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, default "Reset". The visible button text.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <ResetInput />
    //
    // Examples:
    //   <!-- Custom label -->
    //   <ResetInput value="Clear form" />
    //
    //   <!-- Conditionally disabled -->
    //   <ResetInput value="Start over" disabled={!formDirty} />
    //
    // Keyboard:
    //   - Enter: activates the reset button (native behavior)
    //   - Space: activates the reset button (native behavior)
    //
    // Accessibility:
    //   - Native <input type="reset"> has implicit button role
    //   - The value attribute serves as the accessible name
    //   - No additional ARIA attributes needed
    //
    // Internationalization:
    //   - The value prop externalizes the button text for localization
    //   - Default "Reset" should be overridden in non-English contexts
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses native browser form reset behavior, no custom logic
    //   - No children snippet — button text comes from the value prop
    //
    // References:
    //   - MDN input type="reset": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/reset

    let {
        class: className = "",
        value = "Reset",
        disabled = false,
        ...restProps
    }: {
        /** Button text. */
        value?: string;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ResetInput.svelte -->
<input
    class={`reset-input ${className}`}
    type="reset"
    {value}
    {disabled}
    {...restProps}
/>
