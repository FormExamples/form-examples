<script lang="ts">
    // OneTimePasswordInput component
    //
    // A headless one-time-password (OTP / verification code) field. It is ONE real
    // native <input>, not a row of segmented boxes (see PinInputDiv for that), so
    // SMS / password-manager autofill (autocomplete="one-time-code") and paste work.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   length — number, required. Number of characters in the code (maxlength). No default.
    //   value — string, default "". Bindable.
    //   inputMode — string, default "numeric". Use "text" for alphanumeric codes.
    //   pattern — string, default "[0-9]*". Use e.g. "[A-Za-z0-9]*" for alphanumeric codes.
    //   name — string, optional. Form field name.
    //   required, disabled — boolean, default false.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <OneTimePasswordInput label="Verification code" length={6} bind:value />
    //
    // Keyboard:
    //   - None beyond native input behavior
    //
    // Accessibility:
    //   - aria-label={label} provides the accessible name
    //   - autocomplete="one-time-code" lets the platform offer the received code
    //
    // Internationalization:
    //   - The label prop accepts any translated string; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Never validates or submits; the consumer owns verification

    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        length,
        value = $bindable(""),
        inputMode = "numeric",
        pattern = "[0-9]*",
        name = undefined,
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Number of characters in the code. */
        length: number;
        /** Current value. Bindable. */
        value?: string;
        /** Virtual keyboard hint. */
        inputMode?: string;
        /** Allowed characters pattern. */
        pattern?: string;
        /** Form field name. */
        name?: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "OneTimePasswordInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- OneTimePasswordInput.svelte -->
<input
    class={`one-time-password-input ${className}`}
    type="text"
    inputmode={inputMode as any}
    autocomplete="one-time-code"
    maxlength={length}
    {pattern}
    spellcheck={false}
    autocapitalize="off"
    aria-label={label}
    data-length={length}
    {name}
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
