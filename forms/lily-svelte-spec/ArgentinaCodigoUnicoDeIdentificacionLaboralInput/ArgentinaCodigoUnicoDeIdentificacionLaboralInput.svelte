<script lang="ts">
    // ArgentinaCodigoUnicoDeIdentificacionLaboralInput component
    //
    // A headless input for entering Argentina's Código Único de Identificación Laboral (CUIL).
    // Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.
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
    //   <ArgentinaCodigoUnicoDeIdentificacionLaboralInput label="Código Único de Identificación Laboral (CUIL)" bind:value />
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
    //   - https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral

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
            "ArgentinaCodigoUnicoDeIdentificacionLaboralInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- ArgentinaCodigoUnicoDeIdentificacionLaboralInput.svelte -->
<input
    class={`argentina-codigo-unico-de-identificacion-laboral-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
