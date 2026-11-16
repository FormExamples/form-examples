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
    //   counterTemplate — string, default "{count} / {max}": the numbers alone, no English. Counter text template.
    //   announceDelay — number, default 1000. Milliseconds of quiet before the counter's status takes the new count.
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
    //   - the visible counter text is aria-hidden; a visually hidden role="status" (.screen-reader-span) takes the same
    //     text announceDelay ms after typing pauses, so a run of keystrokes is announced once, as GOV.UK does
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

    import { untrack } from "svelte";
    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        maxLength,
        counterTemplate = "{count} / {max}",
        announceDelay = 1000,
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
        /** Milliseconds of quiet before the counter's status takes the new count. */
        announceDelay?: number;
        rows?: number;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "TextAreaInputWithCharacterCounter",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    const uid = $props.id();
    const counterId = `counter-${uid}`;

    let counterText = $derived(
        counterTemplate
            .replace("{count}", String(value.length))
            .replace("{max}", String(maxLength)),
    );

    // The status takes the text only once typing has paused for announceDelay ms.
    let announced = $state(untrack(() => counterText));
    $effect(() => {
        const next = counterText;
        const timer = setTimeout(() => (announced = next), announceDelay);
        return () => clearTimeout(timer);
    });
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
        {disabled}></textarea>
    <span id={counterId}>
        <span aria-hidden="true">{counterText}</span>
        <span
            class="screen-reader-span"
            role="status">{announced}</span
        >
    </span>
</div>
