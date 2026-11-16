<script lang="ts">
    import { warnMissingName } from "../dev-warning";
    import { untrack } from "svelte";
    // PinInputDiv component
    //
    // A headless PIN input that renders a group of single-character numeric inputs
    // for entering PINs, verification codes, or one-time passwords (OTPs). Each
    // digit occupies its own input field, creating a segmented entry experience that
    // communicates the expected code length. Focus auto-advances on digit entry and
    // retreats on Backspace. Commonly used in two-factor authentication, SMS
    // verification, and secure PIN entry interfaces.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the group of inputs via aria-label.
    //   length — number, default 4. Number of digit inputs to render.
    //   digitLabel — (position, length) => string, optional. Each input's accessible name; defaults to `label`.
    //   value — string, default "". Bindable combined string of all entered digits.
    //   disabled — boolean, default false. Whether all inputs are disabled.
    //   ...restProps — additional HTML attributes spread onto the group <div>.
    //
    // Syntax:
    //   <PinInputDiv label="Enter PIN" bind:value />
    //
    // Examples:
    //   <!-- 4-digit PIN input -->
    //   <PinInputDiv label="Enter PIN" bind:value={pin} />
    //
    //   <!-- 6-digit verification code -->
    //   <PinInputDiv label="Verification Code" length={6} bind:value={code} />
    //
    //   <!-- Disabled PIN input -->
    //   <PinInputDiv label="Locked PIN" disabled />
    //
    // Keyboard:
    //   - Digit entry: enters value and auto-focuses next input
    //   - Backspace: clears current digit or moves to previous input if empty
    //   - ArrowLeft: focuses previous input
    //   - ArrowRight: focuses next input
    //   - Tab: standard tab navigation in/out of the group
    //
    // Accessibility:
    //   - role="group" with aria-label on the container identifies the PIN group
    //   - Each input is named by `digitLabel(position, length)` when given (e.g. "Digit 2 of 4"), else by `label`
    //   - inputmode="numeric" ensures numeric keyboard on mobile devices
    //   - maxlength="1" restricts each input to a single character
    //
    // Internationalization:
    //   - The label prop is consumer-provided for the group name
    //   - Each digit's name comes from the consumer's `digitLabel`; without it the group `label` is used. No English default
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Only accepts numeric characters (0-9); non-numeric input is rejected
    //   - The length prop is captured at initialization; do not change dynamically
    //   - Uses internal $state for digits array and $derived for combined value
    //
    // References:
    //   - WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group

    let {
        class: className = "",
        label,
        length = 4,
        digitLabel,
        value = $bindable(""),
        disabled = false,
        ...restProps
    }: {
        /** Accessible label for the group of inputs */
        label: string;
        /** Number of digit inputs to render */
        length?: number;
        /**
         * Each digit input's accessible name, e.g. (n, of) => `Digit ${n} of ${of}`.
         * Without it each input is named by `label`: no English default.
         */
        digitLabel?: (position: number, length: number) => string;
        /** Combined string of all entered digits, bindable */
        value?: string;
        /** Whether all inputs are disabled */
        disabled?: boolean;
        /** Additional HTML attributes */
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "PinInputDiv",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    // Internal state: array of individual digit characters.
    // Note: the length prop is captured at initialization time for the initial
    // array size. This is intentional -- the pin length is expected to be static.
    // Seeded from the initial `value`: starting empty meant the effect below
    // overwrote a bound starting value with "" on mount.
    const initialDigits = untrack(() =>
        Array.from({ length }, (_, i) => (/^[0-9]$/.test(value[i] ?? "") ? value[i] : "")),
    );
    let digits: string[] = $state([...initialDigits]);

    // References to each input element for focus management
    let inputRefs: HTMLInputElement[] = $state([]);

    // Sync the combined value from the digits array whenever digits change
    let combinedValue = $derived(digits.join(""));

    // Keep the bindable value in sync with the derived combined value
    $effect(() => {
        value = combinedValue;
    });

    // Form reset: the digit inputs use a one-way `value`, which a reset clears
    // without telling this component, so `value` would keep digits the fields no
    // longer show. Restore the initial digits instead — one tick later, after the
    // browser has reset the DOM, and not when the reset was cancelled.
    let root: HTMLDivElement | undefined = $state();
    $effect(() => {
        const form = root?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented) return;
                digits = [...initialDigits];
                inputRefs.forEach((input, i) => {
                    if (input) input.value = initialDigits[i];
                });
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
    });

    // Handle input events on individual digit fields
    function handleInput(index: number, event: Event): void {
        const target = event.target as HTMLInputElement;
        const inputValue = target.value;

        // Only accept numeric characters
        if (inputValue && !/^[0-9]$/.test(inputValue)) {
            target.value = digits[index];
            return;
        }

        // Update the digit in our state array
        digits[index] = inputValue;

        // Auto-focus the next input if a digit was entered
        if (inputValue && index < length - 1) {
            inputRefs[index + 1]?.focus();
        }
    }

    // Handle keyboard navigation between digit inputs
    function handleKeydown(index: number, event: KeyboardEvent): void {
        const target = event.target as HTMLInputElement;

        if (event.key === "Backspace") {
            if (!target.value && index > 0) {
                // If current input is empty, move focus to previous and clear it
                inputRefs[index - 1]?.focus();
                digits[index - 1] = "";
            } else {
                // Clear current input
                digits[index] = "";
            }
        } else if (event.key === "ArrowLeft" && index > 0) {
            // Navigate to previous input
            inputRefs[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < length - 1) {
            // Navigate to next input
            inputRefs[index + 1]?.focus();
        }
    }
</script>

<!-- PinInputDiv.svelte -->
<div
    bind:this={root}
    class={`pin-input-div ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {#each Array.from({ length }, (_, i) => i) as index}
        <input
            bind:this={inputRefs[index]}
            type="text"
            inputmode="numeric"
            maxlength="1"
            aria-label={digitLabel ? digitLabel(index + 1, length) : label}
            value={digits[index]}
            {disabled}
            oninput={(e) => handleInput(index, e)}
            onkeydown={(e) => handleKeydown(index, e)}
        />
    {/each}
</div>
