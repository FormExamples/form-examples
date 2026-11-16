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
    //   onSelect — function, optional. Called with the chosen option's data-value, else its text.
    //   children — Snippet, required. Option elements rendered inside the listbox dropdown.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <Combobox label="Search" bind:value bind:open>
    //     <div role="option">Option 1</div>
    //   </Combobox>
    //
    // Examples:
    //   <!-- Combobox with filtered options -->
    //   <Combobox label="Select a fruit" bind:value bind:open>
    //     {#each filtered as option}
    //       <div role="option">{option}</div>
    //     {/each}
    //   </Combobox>
    //
    // Keyboard:
    //   - ArrowDown, ArrowUp: open on the first or last option, then move and wrap
    //   - Home, End: jump to the first or last option while open
    //   - Enter: choose the highlighted option
    //   - Escape: close while open; left alone while closed
    //   - Alt+ArrowDown opens without a highlight; Alt+ArrowUp closes
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
    //   - combobox-keys.ts owns the keys, typing, blur and pointer: the one module the catalogs share
    //
    // References:
    //   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";

    const uid = $props.id();
    const listboxId = `combobox-listbox-${uid}`;

    import { popoverState } from "../Popover/popover.js";
    import { attachCombobox, setActiveOption } from "./combobox-keys";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        open = $bindable(false),
        onSelect = undefined,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current input value. Bindable. */
        value?: string;
        /** Whether dropdown is open. Bindable. */
        open?: boolean;
        /** Called with the chosen option's value. */
        onSelect?: (value: string) => void;
        /** Dropdown option elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Combobox", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    let input = $state<HTMLInputElement>();
    let list = $state<HTMLElement>();

    $effect(() => {
        if (!input || !list) return;
        return attachCombobox(input, list, {
            open: () => open,
            setOpen: (next) => (open = next),
            choose: (chosen) => {
                value = chosen;
                onSelect?.(chosen);
            },
        });
    });

    // Closed from outside: no highlight survives into the next opening.
    $effect(() => {
        if (!open && input && list) setActiveOption(input, list, null);
    });
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
        bind:this={input}
        bind:value
    />
    <div
        bind:this={list}
        role="listbox"
        popover="manual"
        use:popoverState={open}
        id={listboxId}
        aria-label={label}
    >
        {@render children?.()}
    </div>
</div>
