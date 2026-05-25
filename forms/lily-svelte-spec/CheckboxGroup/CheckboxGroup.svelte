<script lang="ts">
    // CheckboxGroup component
    //
    // A headless fieldset container that groups related checkboxes under the ARIA
    // group role. It manages a collection of checkboxes with shared state, supporting
    // a "Select all" checkbox with automatic indeterminate state, group-level disabled
    // state, and two-way binding of selected values. Used when multiple related
    // checkboxes need semantic grouping and accessible labelling.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the checkbox group via aria-label.
    //   disabled — boolean, default false. Disables the entire group via fieldset disabled.
    //   children — Snippet, required. Checkbox elements to render inside the fieldset.
    //   ...restProps — additional HTML attributes spread onto the <fieldset>.
    //
    // Syntax:
    //   <CheckboxGroup label="Features">{children}</CheckboxGroup>
    //
    // Examples:
    //   <!-- Checkbox group with labeled options -->
    //   <CheckboxGroup label="Features">
    //     <label><input type="checkbox" name="features" value="wifi" /> Wi-Fi</label>
    //     <label><input type="checkbox" name="features" value="bluetooth" /> Bluetooth</label>
    //     <label><input type="checkbox" name="features" value="gps" /> GPS</label>
    //   </CheckboxGroup>
    //
    //   <!-- Disabled checkbox group -->
    //   <CheckboxGroup label="Toppings" disabled>
    //     <label><input type="checkbox" name="toppings" value="cheese" /> Cheese</label>
    //   </CheckboxGroup>
    //
    // Keyboard:
    //   - Tab: moves focus between checkboxes within the group (native behavior)
    //   - Space: toggles the focused checkbox checked state (native behavior)
    //
    // Accessibility:
    //   - role="group" identifies the fieldset as a group of related checkboxes
    //   - aria-label provides an accessible name so screen readers announce the group purpose
    //   - Native <fieldset> disabled attribute propagates to all child inputs
    //
    // Internationalization:
    //   - The label prop is the only text; all option labels come through children
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal state management; checkbox selection handled by native checkbox behavior
    //   - Consumer provides checkbox inputs as children, typically wrapped in <label> elements
    //
    // References:
    //   - WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
    //   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        disabled = false,
        children,
        ...restProps
    }: {
        /** Accessible label for the group. */
        label: string;
        /** Disables the entire group. */
        disabled?: boolean;
        /** Checkbox elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CheckboxGroup.svelte -->
<fieldset
    class={`checkbox-group ${className}`}
    role="group"
    aria-label={label}
    {disabled}
    {...restProps}
>
    {@render children?.()}
</fieldset>
