<script lang="ts">
    // DataFilterForm component
    //
    // A headless data filter container that wraps filter controls in a semantic <form>
    // with role="search" and accessible labelling. It prevents default form submission,
    // allowing the consumer's onsubmit callback to handle filter application
    // programmatically. Suitable for client-side filtering, AJAX-based search, or any
    // scenario where a full page reload is undesirable.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the filter region via aria-label.
    //   onsubmit — (event: SubmitEvent) => void, default undefined. Called when the form is submitted.
    //   onreset — (event: Event) => void, default undefined. Called when the form is reset.
    //   children — Snippet, required. Filter controls rendered inside the form.
    //   ...restProps — additional HTML attributes spread onto the <form>.
    //
    // Syntax:
    //   <DataFilterForm label="Filter results" onsubmit={applyFilters}>
    //     <button type="submit">Apply</button>
    //   </DataFilterForm>
    //
    // Examples:
    //   <!-- Filter with category select, submit, and reset -->
    //   <DataFilterForm label="Filter results" onsubmit={applyFilters} onreset={clearFilters}>
    //     <label>Category <select>...</select></label>
    //     <button type="submit">Apply</button>
    //     <button type="reset">Clear</button>
    //   </DataFilterForm>
    //
    // Keyboard:
    //   - None — passive container; keyboard behavior is determined by consumer-provided form controls
    //
    // Accessibility:
    //   - role="search" identifies the form as a search landmark for assistive technology
    //   - aria-label provides an accessible name for the search region
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //   - All filter controls and button text are provided by consumers
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Form submission is prevented by default; consumer handles logic in onsubmit
    //
    // References:
    //   - WAI-ARIA Landmark Roles: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
    //   - ARIA search role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        onsubmit = undefined,
        onreset = undefined,
        children,
        ...restProps
    }: {
        /** Accessible name for the filter region. */
        label: string;
        /** Called when the filter form is submitted. */
        onsubmit?: (event: SubmitEvent) => void;
        /** Called when the filter form is reset. */
        onreset?: (event: Event) => void;
        /** Filter controls rendered inside the form. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        onsubmit?.(event);
    }
</script>

<!-- DataFilterForm.svelte -->
<form
    class={`data-filter-form ${className}`}
    role="search"
    aria-label={label}
    onsubmit={handleSubmit}
    {onreset}
    {...restProps}
>
    {@render children?.()}
</form>
