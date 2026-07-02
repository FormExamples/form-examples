<script lang="ts">
    // SearchInput component
    //
    // A headless search field using the native HTML <input type="search"> element.
    // Provides semantic search meaning and may trigger browser-specific behaviors
    // such as a clear button, search icon, or search-optimized mobile keyboard.
    // Commonly used for site-wide search bars, filtering lists, and query entry.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Current search text; bindable with bind:value.
    //   required — boolean, default false. Whether the field must be filled before form submission.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <SearchInput label="Search" bind:value />
    //
    // Examples:
    //   <!-- Required search with binding -->
    //   <SearchInput label="Filter products" bind:value={query} required />
    //
    //   <!-- With placeholder and name -->
    //   <SearchInput label="Search articles" bind:value placeholder="Type to search..." name="q" />
    //
    // Keyboard:
    //   - Escape: clears the search field (browser-native behavior for search inputs)
    //   - Enter: submits the containing form (standard input behavior)
    //
    // Accessibility:
    //   - aria-label provides the accessible name since there is no visible <label> element
    //   - Native <input type="search"> has implicit search semantics
    //
    // Internationalization:
    //   - The label prop externalizes the accessible name for localization
    //   - Placeholder text should be provided via restProps for localization
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Value uses $bindable() for two-way binding with bind:value
    //   - No visible <label> element — relies on aria-label
    //
    // References:
    //   - MDN input type="search": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search
    //   - WAI-ARIA Search Role: https://www.w3.org/WAI/ARIA/apg/patterns/search/

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

<!-- SearchInput.svelte -->
<input
    class={`search-input ${className}`}
    type="search"
    aria-label={label}
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
