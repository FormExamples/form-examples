<script lang="ts">
    // Option component
    //
    // A headless <option> element wrapper for use inside <select> elements. It
    // accepts a value prop for the form submission value and renders children as
    // the visible option label text. Supports selected and disabled states using
    // native HTML attributes. Used in dropdown menus, form selects, and list pickers.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, required. The option value submitted with the form.
    //   selected — boolean, default false. Whether this option is pre-selected.
    //   disabled — boolean, default false. Whether this option is disabled.
    //   children — Snippet, required. The option label text content.
    //   ...restProps — additional HTML attributes spread onto the <option>.
    //
    // Syntax:
    //   <Option value="us">United States</Option>
    //
    // Examples:
    //   <!-- Options inside a select -->
    //   <select>
    //     <Option value="us">United States</Option>
    //     <Option value="uk">United Kingdom</Option>
    //     <Option value="ca" disabled>Canada</Option>
    //   </select>
    //
    // Keyboard:
    //   None directly — keyboard behavior is managed by the parent <select> element
    //   (Up/Down arrows, Home/End, type-ahead search).
    //
    // Accessibility:
    //   - Native <option> element provides built-in accessibility via the parent <select>
    //   - Screen readers announce the option text and selected state automatically
    //
    // Internationalization:
    //   - Option label text comes through the children snippet
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a <select> element for proper semantics
    //   - Do not add ARIA attributes — native <option> provides all accessibility
    //
    // References:
    //   - HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        value,
        selected = false,
        disabled = false,
        children,
        ...restProps
    }: {
        /** The value of this option */
        value: string;
        /** Whether this option is pre-selected */
        selected?: boolean;
        /** Whether this option is disabled */
        disabled?: boolean;
        /** The option label content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Option.svelte -->
<option
    class={`option ${className}`}
    {value}
    {selected}
    {disabled}
    {...restProps}>{@render children?.()}</option
>
