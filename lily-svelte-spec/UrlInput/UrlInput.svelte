<script lang="ts">
    // UrlInput component
    //
    // A headless URL input using the native HTML <input type="url"> element, which
    // provides built-in URL validation and may trigger URL-specific keyboard layouts
    // on mobile devices. Commonly used in profile forms, link submission pages, and
    // any context where users need to enter a valid web address. The browser's
    // built-in validation ensures the entered value matches URL format.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Bindable URL value; supports bind:value.
    //   required — boolean, default false. Whether the field is required.
    //   disabled — boolean, default false. Whether the field is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <UrlInput label="Website URL" bind:value />
    //
    // Examples:
    //   <!-- Required portfolio URL -->
    //   <UrlInput label="Portfolio link" bind:value={portfolioUrl} required />
    //
    // Keyboard:
    //   - None beyond native text input behavior
    //
    // Accessibility:
    //   - aria-label={label} provides the accessible name since no visible label is associated
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable() for two-way data binding on value
    //   - Browser validates URL format including protocol on form submission
    //
    // References:
    //   - MDN input type="url": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current value. Bindable. */
        value?: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- UrlInput.svelte -->
<input
    class={`url-input ${className}`}
    type="url"
    aria-label={label}
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
