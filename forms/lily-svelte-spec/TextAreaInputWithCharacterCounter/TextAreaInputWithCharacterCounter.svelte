<script lang="ts">
    // TextAreaInputWithCharacterCounter component
    //
    // A headless component that wraps a native <textarea> and a character counter
    // caption inside a <div>. The counter displays "[number] of [maximum] characters"
    // below the text-area-input and updates reactively as the user types. Useful for
    // feedback forms, comment fields, bio inputs, and any interface with a character limit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the text-area-input via aria-label.
    //   value — string, default "". Bindable text-area-input value.
    //   maxLength — number, required. Maximum number of characters allowed.
    //   counterTemplate — string, default "{count} of {max} characters". Counter text template.
    //   rows — number, optional. Number of visible text rows.
    //   placeholder — string, optional. Placeholder text for the text-area-input.
    //   required — boolean, default false. Whether the text-area-input is required.
    //   disabled — boolean, default false. Whether the text-area-input is disabled.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <TextAreaInputWithCharacterCounter label="Feedback" maxLength={500} bind:value />
    //
    // Keyboard:
    //   - Tab: Focus the text-area-input (native browser behavior)
    //   - Standard text-area-input keyboard interactions
    //
    // Accessibility:
    //   - aria-label on the text-area-input provides accessible name
    //   - aria-describedby links text-area-input to the counter
    //   - aria-live="polite" on counter announces updates to screen readers
    //
    // Internationalization:
    //   - counterTemplate prop allows full customization of counter text
    //   - {count} and {max} placeholders are replaced with actual values
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - restProps spread onto the wrapper <div>, not the text-area-input
    //
    // References:
    //   - MDN text-area-input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/text-area-input

    let {
        class: className = "",
        label,
        value = $bindable(""),
        maxLength,
        counterTemplate = "{count} of {max} characters",
        rows = undefined,
        placeholder = undefined,
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        value?: string;
        maxLength: number;
        counterTemplate?: string;
        rows?: number;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    const uid = $props.id();
    const counterId = `counter-${uid}`;

    let counterText = $derived(
        counterTemplate.replace("{count}", String(value.length)).replace("{max}", String(maxLength))
    );
</script>

<!-- TextAreaInputWithCharacterCounter.svelte -->
<div
    class={`text-area-input-with-character-counter ${className}`}
    {...restProps}
>
    <textarea
        aria-label={label}
        aria-describedby={counterId}
        bind:value
        maxlength={maxLength}
        {rows}
        {placeholder}
        {required}
        {disabled}
    ></textarea>
    <span
        id={counterId}
        aria-live="polite"
    >
        {counterText}
    </span>
</div>
