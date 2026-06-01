<script lang="ts">
    // Select component
    //
    // A headless wrapper around the native HTML <select> element for choosing one
    // option from a dropdown list. The consumer provides <option> elements as
    // children, giving full control over available choices. Commonly used in forms
    // for selecting countries, categories, statuses, or other predefined values.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Currently selected value; bindable with bind:value.
    //   required — boolean, default false. Whether the select is required for form submission.
    //   disabled — boolean, default false. Whether the select is disabled.
    //   children — Snippet, required. <option> elements to render inside the select.
    //   ...restProps — additional HTML attributes spread onto the <select>.
    //
    // Syntax:
    //   <Select label="Country" bind:value>
    //     <option value="us">United States</option>
    //   </Select>
    //
    // Examples:
    //   <!-- Required select with placeholder -->
    //   <Select label="Priority" bind:value={priority} required>
    //     <option value="">Select priority...</option>
    //     <option value="low">Low</option>
    //     <option value="high">High</option>
    //   </Select>
    //
    //   <!-- Disabled select -->
    //   <Select label="Status" bind:value disabled={isReadOnly}>
    //     <option value="active">Active</option>
    //     <option value="inactive">Inactive</option>
    //   </Select>
    //
    // Keyboard:
    //   - Tab: moves focus to/from the select (native browser behavior)
    //   - Space/Enter: opens the dropdown list (native browser behavior)
    //   - Arrow Up/Down: navigates through options (native browser behavior)
    //   - Escape: closes the dropdown list (native browser behavior)
    //   - Home/End: jumps to first/last option (native browser behavior)
    //   - Type-ahead: typing characters jumps to matching options (native browser behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name since there is no visible <label> element
    //   - Native <select> has implicit combobox/listbox role with built-in semantics
    //
    // Internationalization:
    //   - The label prop externalizes the accessible name for localization
    //   - Option text is provided by the consumer via children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Value uses $bindable() for two-way binding with bind:value
    //   - Children snippet renders <option> elements inside the native <select>
    //
    // References:
    //   - MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current selected value. Bindable. */
        value?: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        /** Option elements to render inside. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Select.svelte -->
<select
    class={`select ${className}`}
    aria-label={label}
    bind:value
    {required}
    {disabled}
    {...restProps}
>
    {@render children?.()}
</select>
