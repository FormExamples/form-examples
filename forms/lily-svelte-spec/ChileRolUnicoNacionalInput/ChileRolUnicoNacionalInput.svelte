<script lang="ts">
    // ChileRolUnicoNacionalInput component
    //
    // A headless input for entering Chile's Rol Único Nacional (RUN).
    // Format: Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". Bindable input value; supports bind:value.
    //   required — boolean, default false. Whether the input is required for form submission.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <ChileRolUnicoNacionalInput label="Rol Único Nacional (RUN)" bind:value />
    //
    // Accessibility:
    //   - aria-label provides the accessible name for screen readers
    //   - autocomplete="off" protects sensitive identifiers
    //   - required and disabled states are conveyed to assistive technology
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //
    // References:
    //   - https://en.wikipedia.org/wiki/RUT

    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "ChileRolUnicoNacionalInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- ChileRolUnicoNacionalInput.svelte -->
<input
    class={`chile-rol-unico-nacional-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
