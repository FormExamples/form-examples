<script lang="ts">
    // ThemeSelect component
    //
    // A headless theme picker that renders a <fieldset> with the radiogroup role,
    // providing an accessible container for radio button options to select between
    // themes such as light, dark, or system preference. Useful for settings pages,
    // preference panels, or any interface where users need to select from a set of
    // theme options. Consumers provide the radio button markup as children.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the radio group via aria-label.
    //   children — Snippet, required. Radio button option elements.
    //   ...restProps — additional HTML attributes spread onto the <fieldset>.
    //
    // Syntax:
    //   <ThemeSelect label="Theme">...</ThemeSelect>
    //
    // Examples:
    //   <!-- Theme picker with radio options -->
    //   <ThemeSelect label="Theme">
    //     <label><input type="radio" name="theme" value="light" /> Light</label>
    //     <label><input type="radio" name="theme" value="dark" /> Dark</label>
    //     <label><input type="radio" name="theme" value="system" /> System</label>
    //   </ThemeSelect>
    //
    // Keyboard:
    //   - Arrow keys: navigate between radio options (native radio behavior)
    //   - Space: select the focused radio option (native radio behavior)
    //
    // Accessibility:
    //   - role="radiogroup" identifies the fieldset as a group of related radio buttons
    //   - aria-label={label} provides an accessible name describing the theme selection
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - Radio option labels are consumer-provided and can be localized
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Consumer provides <input type="radio"> elements as children
    //
    // References:
    //   - WAI-ARIA radiogroup role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
    //   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Theme radio options. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ThemeSelect.svelte -->
<fieldset
    class={`theme-select ${className}`}
    role="radiogroup"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</fieldset>
