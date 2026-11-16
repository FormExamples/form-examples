<script lang="ts">
    // Editable component
    //
    // An inline-editable text component that toggles between a read-only display
    // and an input field for editing. The root is a <div class="editable">; in
    // display mode it holds a native <button type="button"> showing the value, and
    // in edit mode an <input type="text">. Pressing Enter confirms the edit and
    // Escape cancels it, reverting to the original value. Focus moves to the input
    // on edit, and back to the button on confirm or cancel.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, default "". Current text value; bindable.
    //   label — string, required. Accessible name for the editable control.
    //   editing — boolean, default false. Whether the component is in edit mode; bindable.
    //   disabled — boolean, default false. Whether editing is disabled.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <Editable label="Name" bind:value />
    //
    // Examples:
    //   <!-- Basic inline edit -->
    //   <Editable label="Name" bind:value />
    //
    //   <!-- With external editing state control -->
    //   <Editable label="Title" bind:value bind:editing />
    //
    // Keyboard:
    //   - Enter or Space (display mode): activate edit mode (the native button's own keys)
    //   - Enter (edit mode): confirm the edit and return to display mode
    //   - Escape (edit mode): cancel the edit and return to display mode
    //
    // Accessibility:
    //   - a native <button> in display mode: focusable, Enter and Space, no role to add
    //   - aria-label provides the accessible name in both modes; in display mode it starts with the visible value
    //   - the button is disabled when `disabled` is true
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses internal draft state to allow cancel without losing original value
    //   - Both value and editing support $bindable() two-way binding
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    import { tick } from "svelte";
    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        value = $bindable(""),
        label,
        editing = $bindable(false),
        disabled = false,
        ...restProps
    }: {
        /** Current text value. Bindable. */
        value?: string;
        /** Accessible label for the editable control. */
        label: string;
        /** Whether the component is in edit mode. Bindable. */
        editing?: boolean;
        /** Whether editing is disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("Editable", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    let draft = $state(value);
    let input: HTMLInputElement | undefined = $state();
    let button: HTMLButtonElement | undefined = $state();

    // The element that had focus is removed by the switch, so focus follows the user to the element that replaces it.
    async function startEditing() {
        if (disabled) return;
        draft = value;
        editing = true;
        await tick();
        input?.focus();
    }

    async function finish() {
        editing = false;
        await tick();
        button?.focus();
    }

    function confirm() {
        value = draft;
        void finish();
    }

    function cancel() {
        draft = value;
        void finish();
    }

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            confirm();
        } else if (event.key === "Escape") {
            event.preventDefault();
            cancel();
        }
    }
</script>

<!-- Editable.svelte -->
<div
    class={`editable ${className}`}
    {...restProps}
>
    {#if editing}
        <input
            bind:this={input}
            class="editable-input"
            type="text"
            aria-label={label}
            bind:value={draft}
            {onkeydown}
        />
    {:else}
        <button
            bind:this={button}
            class="editable-button"
            type="button"
            aria-label={value ? `${value}, ${label}` : label}
            {disabled}
            onclick={startEditing}
        >
            {value}
        </button>
    {/if}
</div>
