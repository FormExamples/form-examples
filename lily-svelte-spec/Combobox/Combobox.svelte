<script lang="ts">
    // Combobox component
    //
    // A headless combobox combining a text input with a dropdown listbox of
    // suggestions for autocomplete or type-ahead search experiences. Users type into
    // the input to filter suggestions, then select from matching options in the
    // dropdown. Commonly used for search fields, address inputs, tag selectors, and
    // choosing from large option sets.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label on both input and listbox.
    //   value — string, default "". Bindable current text input value.
    //   open — boolean, default false. Bindable dropdown visibility state.
    //   children — Snippet, required. Option elements rendered inside the listbox dropdown.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <Combobox label="Search" bind:value bind:open>
    //     <div role="option" tabindex="-1">Option 1</div>
    //   </Combobox>
    //
    // Examples:
    //   <!-- Combobox with filtered options -->
    //   <Combobox label="Select a fruit" bind:value bind:open>
    //     {#each filtered as option}
    //       <div role="option" tabindex="-1" onclick={() => { value = option; open = false; }}>
    //         {option}
    //       </div>
    //     {/each}
    //   </Combobox>
    //
    // Keyboard:
    //   - Escape: Close the dropdown listbox
    //
    // Accessibility:
    //   - role="combobox" on the input identifies it as a combobox widget
    //   - aria-expanded reflects the open state for screen readers
    //   - aria-controls links the input to the associated listbox by ID
    //   - aria-autocomplete="list" indicates suggestions are provided via a list
    //   - role="listbox" on the dropdown identifies selectable options
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //   - All option content is provided by consumers through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Generates a unique listboxId for the aria-controls relationship
    //   - Consumer is responsible for filtering options based on value
    //
    // References:
    //   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

    import type { Snippet } from "svelte";

    const uid = $props.id();
    const listboxId = `combobox-listbox-${uid}`;

    let {
        class: className = "",
        label,
        value = $bindable(""),
        open = $bindable(false),
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current input value. Bindable. */
        value?: string;
        /** Whether dropdown is open. Bindable. */
        open?: boolean;
        /** Dropdown option elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            open = false;
        }
    }
</script>

<!-- Combobox.svelte -->
<div
    class={`combobox ${className}`}
    {...restProps}
>
    <input
        type="text"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        bind:value
        {onkeydown}
    />
    {#if open}
        <div
            role="listbox"
            id={listboxId}
            aria-label={label}
        >
            {@render children?.()}
        </div>
    {/if}
</div>
