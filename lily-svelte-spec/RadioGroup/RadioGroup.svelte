<script lang="ts">
    // RadioGroup component
    //
    // A headless fieldset container that groups related radio buttons under the ARIA
    // radiogroup role. It renders a <fieldset> with role="radiogroup" and an accessible
    // label, enabling screen readers to communicate the relationship between individual
    // radio options. Used when a set of mutually exclusive options is needed, such as
    // selecting a size, choosing a shipping method, or picking a preference.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the radio group via aria-label.
    //   children — Snippet, required. Radio button elements to render inside the fieldset.
    //   ...restProps — additional HTML attributes spread onto the <fieldset>.
    //
    // Syntax:
    //   <RadioGroup label="Size">{children}</RadioGroup>
    //
    // Examples:
    //   <!-- Radio group with labeled options -->
    //   <RadioGroup label="Size">
    //     <label><input type="radio" name="size" value="s" /> Small</label>
    //     <label><input type="radio" name="size" value="m" /> Medium</label>
    //     <label><input type="radio" name="size" value="l" /> Large</label>
    //   </RadioGroup>
    //
    // Keyboard:
    //   - Tab: moves focus into the radio group (to selected or first option)
    //   - Arrow Up / Arrow Down: moves selection between radio buttons (native behavior)
    //   - Space: selects the focused radio button (native behavior)
    //
    // Accessibility:
    //   - role="radiogroup" identifies the fieldset as a group of radio buttons
    //   - aria-label provides an accessible name so screen readers announce the group purpose
    //   - Native <fieldset> provides semantic grouping
    //
    // Internationalization:
    //   - The label prop is the only text; all option labels come through children
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal state management; radio selection handled by native radio behavior
    //   - Consumer provides radio inputs as children, typically wrapped in <label> elements
    //
    // References:
    //   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
    //   - WAI-ARIA Authoring Practices - Radio Group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label for the group. */
        label: string;
        /** Radio button elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- RadioGroup.svelte -->
<fieldset
    class={`radio-group ${className}`}
    role="radiogroup"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</fieldset>
