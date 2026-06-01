<script lang="ts">
    // ThemeSelect component
    //
    // A headless theme selection control that renders a native <select> dropdown
    // for choosing between visual themes or color schemes. Commonly used for
    // light, dark, high-contrast, or system-default theme options. The consumer
    // provides <option> elements as children and is responsible for applying the
    // selected theme value to the page.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Bindable selected theme; supports bind:value.
    //   children — Snippet, required. ThemeSelectOption elements representing available themes.
    //   ...restProps — additional HTML attributes spread onto the <select>.
    //
    // Syntax:
    //   <ThemeSelect label="Theme" bind:value>...</ThemeSelect>
    //
    // Examples:
    //   <!-- theme select with multiple schemes -->
    //   <ThemeSelect label="Color scheme" bind:value={theme}>
    //     <ThemeSelectOption value="light">Light</ThemeSelectOption>
    //     <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
    //     <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
    //     <ThemeSelectOption value="system">System Default</ThemeSelectOption>
    //   </ThemeSelect>
    //
    // Keyboard:
    //   - Tab: moves focus to the select element (native behavior)
    //   - Space/Enter: opens the dropdown (native behavior)
    //   - ArrowUp/ArrowDown: navigates through options (native behavior)
    //   - Escape: closes the dropdown (native behavior)
    //
    // Accessibility:
    //   - aria-label={label} provides an accessible name since no visible <label> is included
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - Option text is consumer-provided and can be localized
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Consumer applies the selected theme value to the page
    //   - Uses $bindable() for two-way data binding on value
    //
    // References:
    //   - MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
    //   - WCAG 1.4.12 Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Selected theme. Bindable. */
        value?: string;
        /** ThemeSelectOption elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ThemeSelect.svelte -->
<select
    class={`theme-select ${className}`}
    aria-label={label}
    bind:value
    {...restProps}
>
    {@render children?.()}
</select>
