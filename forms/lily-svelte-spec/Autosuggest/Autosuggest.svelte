<script lang="ts">
    // Autosuggest component
    //
    // A text input that proposes matching options as users type: the WAI-ARIA
    // combobox pattern with list autocomplete. The input is the combobox; the
    // suggestions are a listbox of options. The consumer computes the
    // suggestions in onInput (filtering, fetching) and passes them back in
    // `suggestions`; the component owns the open state, the highlight, the keys
    // and the selection.
    //
    // Props:
    //   class — string, optional. Appended to the root's class list.
    //   label — string, required. Accessible name of the input and the listbox.
    //   value — string, default "". Bindable. The input's text.
    //   suggestions — { value: string; label: string }[], default []. The options to show.
    //   onInput — (query: string) => void, optional. Called as the user types.
    //   onSelect — (value: string) => void, optional. Called when a suggestion is chosen.
    //   placeholder — string, optional. Placeholder text.
    //   name — string, optional. Form field name of the input.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Autosuggest label="Country" bind:value {suggestions} onInput={search} />
    //
    // Keyboard:
    //   - ArrowDown: open the list / highlight the next option (wraps)
    //   - ArrowUp: open the list / highlight the previous option (wraps)
    //   - Home / End: highlight the first / last option while the list is open
    //   - Enter: choose the highlighted option
    //   - Escape: close the list without choosing
    //
    // Accessibility:
    //   - role="combobox" on the input, aria-autocomplete="list", aria-expanded,
    //     aria-controls naming the listbox, aria-activedescendant naming the
    //     highlighted option (which carries aria-selected="true")
    //   - The list stays in the DOM, hidden while closed, so aria-controls always resolves
    //
    // Claude rules:
    //   - Choosing an option writes its `value` into the input and closes the list
    //   - The list opens only while there are suggestions; blur closes it
    //   - Pressing on an option does not blur the input, so a click can choose it
    //   - A form reset restores the starting text (defaultValue + bind:value)
    //
    // References:
    //   - WAI-ARIA APG combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

    import { warnMissingName } from "../dev-warning";
    import { untrack } from "svelte";

    const uid = $props.id();
    const listId = `autosuggest-list-${uid}`;
    const optionId = (index: number) => `autosuggest-option-${uid}-${index}`;

    let {
        class: className = "",
        label,
        value = $bindable(""),
        suggestions = [],
        onInput = undefined,
        onSelect = undefined,
        placeholder = undefined,
        name = undefined,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** The input's text. Bindable. */
        value?: string;
        /** The options to show. */
        suggestions?: { value: string; label: string }[];
        /** Called with the typed text. */
        onInput?: (query: string) => void;
        /** Called with the chosen suggestion's value. */
        onSelect?: (value: string) => void;
        /** Placeholder text. */
        placeholder?: string;
        /** Form field name. */
        name?: string;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "Autosuggest",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    // The starting text, which a form reset restores (bind:value reads defaultValue).
    const initialValue = untrack(() => value);
    // `wanted` is what the user asked for (typing or arrowing asks for the list; Escape, choosing and blur withdraw it). The list is open only
    // when it is wanted AND there is something to show, so suggestions arriving late from a fetch open it, and an empty result closes it.
    let wanted = $state(false);
    // The highlighted option's index, -1 for none. It resets on typing, choosing, Escape and blur, so Enter never picks a row from an earlier list.
    let active = $state(-1);
    const open = $derived(wanted && suggestions.length > 0);

    function choose(index: number) {
        const suggestion = suggestions[index];
        // Guard against an index from before the suggestions changed.
        if (!suggestion) return;
        value = suggestion.value;
        wanted = false;
        active = -1;
        onSelect?.(suggestion.value);
    }

    function oninput(event: Event) {
        value = (event.currentTarget as HTMLInputElement).value;
        wanted = true;
        active = -1;
        onInput?.(value);
    }

    function onkeydown(event: KeyboardEvent) {
        if (event.isComposing) return; // The key belongs to the IME.
        const count = suggestions.length;
        switch (event.key) {
            case "ArrowDown":
                if (count === 0) return;
                // Alt: open without moving the highlight.
                if (event.altKey) {
                    if (open) return;
                    wanted = true;
                    break;
                }
                // Closed: open on the first option. Open: step down, wrapping from the last to the first.
                active = open ? (active + 1) % count : 0;
                wanted = true;
                break;
            case "ArrowUp":
                // Alt: close.
                if (event.altKey) {
                    if (!open) return;
                    wanted = false;
                    active = -1;
                    break;
                }
                if (count === 0) return;
                // Closed, or at the first option (or none): go to the last. Otherwise step up.
                active = open && active > 0 ? active - 1 : count - 1;
                wanted = true;
                break;
            // Home, End, Enter and Escape return without preventDefault when closed, so the input keeps its normal editing keys (Home moves the caret).
            case "Home":
                if (!open) return;
                active = 0;
                break;
            case "End":
                if (!open) return;
                active = count - 1;
                break;
            case "Enter":
                if (!open || active < 0) return;
                choose(active);
                break;
            case "Escape":
                if (!open) return;
                wanted = false;
                active = -1;
                break;
            default:
                return;
        }
        // Only keys this component acted on reach here; the rest (typing, Tab) keep their native behaviour.
        event.preventDefault();
    }

    function onblur() {
        wanted = false;
        active = -1;
    }
</script>

<!-- Autosuggest.svelte -->
<div
    class={`autosuggest ${className}`}
    {...restProps}
>
    <input
        class="autosuggest-input"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-label={label}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        {placeholder}
        {name}
        bind:value
        defaultValue={initialValue}
        {oninput}
        {onkeydown}
        {onblur}
    />
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions (keeps focus in the input while an option is pressed) -->
    <ul
        class="autosuggest-list"
        role="listbox"
        id={listId}
        aria-label={label}
        hidden={!open}
        onmousedown={(event) => event.preventDefault()}
    >
        {#each suggestions as suggestion, index (suggestion.value)}
            <!-- svelte-ignore a11y_click_events_have_key_events (the input owns the keys) -->
            <li
                class="autosuggest-option"
                role="option"
                id={optionId(index)}
                aria-selected={index === active}
                data-value={suggestion.value}
                onclick={() => choose(index)}
            >
                {suggestion.label}
            </li>
        {/each}
    </ul>
</div>
