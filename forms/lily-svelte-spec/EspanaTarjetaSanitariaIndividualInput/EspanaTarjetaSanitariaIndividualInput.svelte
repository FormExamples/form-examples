<script lang="ts">
    // EspanaTarjetaSanitariaIndividualInput component
    //
    // A headless input for entering a España Tarjeta Sanitaria Individual (TSI),
    // the unique Spanish national healthcare identifier (CIP-SNS). The format
    // varies by Autonomous Community but typically starts with 4 region digits
    // followed by alphanumeric characters.
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
    //   <EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value />
    //
    // Examples:
    //   <!-- Required TSI input -->
    //   <EspanaTarjetaSanitariaIndividualInput label="TSI" required />
    //
    //   <!-- Disabled TSI input -->
    //   <EspanaTarjetaSanitariaIndividualInput label="TSI" disabled />
    //
    // Keyboard:
    //   - Standard text input keyboard behavior
    //
    // Accessibility:
    //   - aria-label provides the accessible name for screen readers
    //   - autocomplete="off" protects sensitive health identifiers
    //   - required and disabled states are conveyed to assistive technology
    //
    // Internationalization:
    //   - The label prop externalizes user-facing text for translation
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable() for two-way data binding on value
    //
    // References:
    //   - Ministerio de Sanidad: https://www.sanidad.gob.es/

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label for screen readers */
        label: string;
        /** The current value of the input, bindable */
        value?: string;
        /** Whether the input is required for form submission */
        required?: boolean;
        /** Whether the input is disabled */
        disabled?: boolean;
        /** Additional HTML attributes */
        [key: string]: unknown;
    } = $props();
</script>

<!-- EspanaTarjetaSanitariaIndividualInput.svelte -->
<input
    class={`espana-tarjeta-sanitaria-individual-input ${className}`}
    type="text"
    aria-label={label}
    autocomplete="off"
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
