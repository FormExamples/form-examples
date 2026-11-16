<script lang="ts">
    // MentionsInput component
    //
    // A text input with at-mention autocomplete suggestions. Renders a wrapper
    // <div> containing an <input role="combobox"> and a suggestions panel.
    // Consumers manage `expanded`, `value`, and the suggestions content.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the input.
    //   value — string, default "". Input value.
    //   triggerChar — string, default "@". Character that opens suggestions.
    //   expanded — boolean, default false. Whether the suggestions panel is open.
    //   placeholder — string, optional.
    //   disabled — boolean, default false.
    //   oninput — (event: Event) => void, optional. Input event handler.
    //   children — Snippet, optional. Suggestions panel content (typically a Listbox).
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <MentionsInput label="Comment" value={text} expanded={open} oninput={handle}>
    //     {#snippet children()}<ul role="listbox">…</ul>{/snippet}
    //   </MentionsInput>
    //
    // Accessibility:
    //   - <input role="combobox"> with aria-haspopup="listbox", aria-expanded,
    //     aria-autocomplete="list", aria-label, and aria-controls pointing at the
    //     suggestions panel's generated id.
    //
    // Internationalization:
    //   - label, placeholder, triggerChar all come through props.
    //
    // Claude rules:
    //   - Headless: no styles.
    //   - label is REQUIRED.
    //
    // References:
    //   - Ant Design Mentions: https://ant.design/components/mentions
    //   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

    import type { Snippet } from "svelte";
    import { attachMentions } from "../widget-keys";

    import { popoverState } from "../Popover/popover.js";

    let {
        class: className = "",
        label,
        value = "",
        triggerChar = "@",
        expanded = $bindable(false),
        onQuery = undefined,
        onSelect = undefined,
        placeholder = undefined,
        disabled = false,
        oninput = undefined,
        children = undefined,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Accessible label (REQUIRED) */
        label: string;
        /** Input value */
        value?: string;
        /** Character that opens the suggestions panel */
        triggerChar?: string;
        /** Whether the suggestions panel is open */
        expanded?: boolean;
        /** Called with the text after the trigger character */
        onQuery?: (query: string) => void;
        /** Called with the mention written */
        onSelect?: (value: string) => void;
        /** Placeholder text */
        placeholder?: string;
        /** Whether the input is disabled */
        disabled?: boolean;
        /** Input event handler */
        oninput?: (event: Event) => void;
        /** Suggestions panel content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const uid = $props.id();
    const suggestionsId = `${uid}-suggestions`;

    let rootEl = $state<HTMLElement>();

    $effect(() =>
        rootEl
            ? attachMentions(rootEl, {
                  onOpen: (open) => (expanded = open),
                  onQuery: (query) => onQuery?.(query),
                  onSelect: (mention) => onSelect?.(mention),
              })
            : undefined,
    );
</script>

<!-- MentionsInput.svelte -->
<div
    bind:this={rootEl}
    class={`mentions-input ${className}`}
    data-trigger-char={triggerChar}
    {...restProps}
>
    <input
        class="mentions-input-control"
        type="text"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-controls={suggestionsId}
        aria-expanded={expanded}
        aria-autocomplete="list"
        {value}
        {placeholder}
        {disabled}
        {oninput}
    />
    <div
        class="mentions-input-suggestions"
        id={suggestionsId}
        popover="manual"
        use:popoverState={expanded}
    >
        {#if children}{@render children?.()}{/if}
    </div>
</div>
