<script lang="ts">
    // Command component
    //
    // A headless command palette providing a searchable list of actions or items.
    // It renders a search region containing a text input and a listbox for results.
    // The search value is bindable, allowing consumers to implement their own filtering
    // logic and dynamically update the listbox content. Commonly used for Ctrl+K quick-access
    // command palettes, searchable menus, and action launchers.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the search region and input.
    //   placeholder — string, default undefined. Placeholder text for the search input.
    //   value — string, default "". Current search text; bindable via bind:value.
    //   children — Snippet, required. Listbox content, typically option or command items.
    //   ...restProps — additional HTML attributes spread onto the outer <div>.
    //
    // Syntax:
    //   <Command label="Command palette" placeholder="Search..." bind:value={query}>
    //     <div role="option">Action</div>
    //   </Command>
    //
    // Examples:
    //   <!-- Command palette with filtered commands -->
    //   <Command label="Command palette" placeholder="Search commands..." bind:value={query}>
    //     {#each filteredCommands as cmd}
    //       <div role="option">{cmd.name}</div>
    //     {/each}
    //   </Command>
    //
    // Keyboard:
    //   - Tab: Move focus into and out of the search input
    //   - Additional keyboard navigation within the listbox should be implemented by the consumer
    //
    // Accessibility:
    //   - role="search" identifies the outer container as a search landmark
    //   - aria-label provides accessible names for the search region, input, and listbox
    //   - role="listbox" identifies the results container for selectable options
    //   - autocomplete="off" prevents browser autocomplete from interfering
    //
    // Internationalization:
    //   - The label and placeholder props provide all text; no hardcoded strings
    //   - All command content is provided by consumers through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Consumer is responsible for filtering and rendering listbox content
    //   - Consumer should implement arrow key navigation within the listbox
    //
    // References:
    //   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
    //   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        placeholder = undefined,
        value = $bindable(""),
        children,
        ...restProps
    }: {
        label: string;
        placeholder?: string;
        value?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Command.svelte -->
<div
    class={`command ${className}`}
    role="search"
    aria-label={label}
    {...restProps}
>
    <input
        type="search"
        bind:value
        aria-label={label}
        {placeholder}
        autocomplete="off"
    />
    <div
        role="listbox"
        aria-label={label}
    >
        {@render children?.()}
    </div>
</div>
