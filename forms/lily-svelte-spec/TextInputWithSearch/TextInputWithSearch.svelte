<script lang="ts">
    // TextInputWithSearch component
    //
    // A headless component that wraps a native <input type="text"> and
    // <button type="button"> inside a <div role="search">. The search button
    // triggers a callback with the current input value. Pressing Enter in the
    // input also triggers the search. Useful for search bars, filter inputs,
    // lookup fields, and any interface with an explicit search action.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the search region via aria-label.
    //   inputLabel — string, default "Search". Accessible name for the text input.
    //   searchLabel — string, default "Search". Accessible label and text for the search button.
    //   value — string, default "". Bindable text input value.
    //   placeholder — string, optional. Placeholder text for the input.
    //   onsearch — (value: string) => void, optional. Callback when search is triggered.
    //   required — boolean, default false. Whether the input is required.
    //   disabled — boolean, default false. Whether the input and button are disabled.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <TextInputWithSearch label="Site search" onsearch={handleSearch} bind:value />
    //
    // Keyboard:
    //   - Tab: Moves focus between input and search button
    //   - Enter in input: Triggers search
    //   - Enter/Space on button: Triggers search
    //
    // Accessibility:
    //   - role="search" on wrapper for search landmark
    //   - aria-label on region, input, and button
    //
    // Internationalization:
    //   - label, inputLabel, searchLabel, placeholder are the only user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - restProps spread onto the wrapper <div>, not the input
    //
    // References:
    //   - WAI-ARIA search role: https://www.w3.org/TR/wai-aria-1.2/#search

    let {
        class: className = "",
        label,
        inputLabel = "Search",
        searchLabel = "Search",
        value = $bindable(""),
        placeholder = undefined,
        onsearch = undefined,
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        inputLabel?: string;
        searchLabel?: string;
        value?: string;
        placeholder?: string;
        onsearch?: (value: string) => void;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    function handleSearch() {
        onsearch?.(value);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    }
</script>

<!-- TextInputWithSearch.svelte -->
<div
    class={`text-input-with-search ${className}`}
    role="search"
    aria-label={label}
    {...restProps}
>
    <input
        type="text"
        aria-label={inputLabel}
        bind:value
        {placeholder}
        {required}
        {disabled}
        onkeydown={handleKeydown}
    />
    <button
        type="button"
        aria-label={searchLabel}
        onclick={handleSearch}
        {disabled}
    >
        {searchLabel}
    </button>
</div>
