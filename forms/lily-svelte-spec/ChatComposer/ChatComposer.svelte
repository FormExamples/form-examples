<script lang="ts">
    // ChatComposer component
    //
    // A headless chat input form: a <textarea> that grows with its content (rows from the number of lines, clamped between minRows and maxRows) and ONE button that is "send" normally and turns into "stop" while `busy`. Enter sends; Shift+Enter inserts a line break; Enter while an IME composition is in progress does nothing. The send button is disabled, never hidden, when the text is empty or the form is disabled. The component never clears the text (the consumer does, in its send handler), never animates, and carries no strings: the textarea name, the send word and the stop word are required props. Models, attachments and menus are consumer composition (put them in the default slot, rendered before the textarea).
    //
    // Props:
    //   class — string, optional. CSS class name.
    //   label — string, required. Accessible name of the textarea.
    //   sendLabel — string, required. Visible/accessible word for the send button.
    //   stopLabel — string, required. Visible/accessible word for the stop button.
    //   value — string, default "". Bindable.
    //   placeholder, name — optional, passed to the textarea.
    //   minRows — number, default 1. maxRows — number, default 8.
    //   busy — boolean, default false. A reply is in progress: the button becomes "stop".
    //   disabled — boolean, default false.
    //   onSend(value) — called on Enter or submit when there is text and not busy/disabled.
    //   onStop() — called when the stop button is pressed.
    //   children — Snippet, optional. Rendered inside the form, before the textarea.
    //   ...restProps — additional HTML attributes spread onto the root <form>.
    //
    // Keyboard: Enter sends; Shift+Enter inserts a line break; Enter during IME composition is ignored.
    //
    // Claude rules:
    //   - Headless: no CSS, no inline styles, no animation, no hardcoded strings
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        sendLabel,
        stopLabel,
        value = $bindable(""),
        placeholder = undefined,
        name = undefined,
        minRows = 1,
        maxRows = 8,
        busy = false,
        disabled = false,
        onSend,
        onStop,
        children,
        ...restProps
    }: {
        /** Accessible name of the textarea. */
        label: string;
        /** Word for the send button. */
        sendLabel: string;
        /** Word for the stop button. */
        stopLabel: string;
        /** The text. Bindable. */
        value?: string;
        placeholder?: string;
        name?: string;
        minRows?: number;
        maxRows?: number;
        /** A reply is in progress. */
        busy?: boolean;
        disabled?: boolean;
        onSend?: (value: string) => void;
        onStop?: () => void;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const empty = $derived(value.trim() === "");
    const rows = $derived(Math.min(maxRows, Math.max(minRows, value.split("\n").length)));

    function trySend(): void {
        if (disabled || busy || empty) return;
        onSend?.(value);
    }

    function onKeydown(event: KeyboardEvent): void {
        if (event.key !== "Enter") return;
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
        // IME: Enter that confirms a composition must not send.
        if (event.isComposing || event.keyCode === 229) return;
        event.preventDefault();
        trySend();
    }

    function onSubmit(event: SubmitEvent): void {
        event.preventDefault();
        trySend();
    }
</script>

<!-- ChatComposer.svelte -->
<form
    class={`chat-composer ${className}`}
    onsubmit={onSubmit}
    {...restProps}
>
    {@render children?.()}
    <textarea
        class="chat-composer-input"
        aria-label={label}
        bind:value
        {rows}
        {placeholder}
        {name}
        {disabled}
        onkeydown={onKeydown}></textarea>
    <button
        class="chat-composer-button"
        type={busy ? "button" : "submit"}
        data-state={busy ? "stop" : "send"}
        disabled={disabled || (!busy && empty)}
        onclick={busy ? () => onStop?.() : undefined}
    >
        <span class="chat-composer-button-label">{busy ? stopLabel : sendLabel}</span>
    </button>
</form>
