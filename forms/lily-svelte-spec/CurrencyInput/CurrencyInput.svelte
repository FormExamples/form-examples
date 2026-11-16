<script lang="ts">
    // CurrencyInput component
    //
    // A currency input rendered as a native <input type="text" inputmode="decimal">.
    // The component does not format the displayed value; formatting
    // (Intl.NumberFormat, separators, currency symbol placement) is the consumer's
    // responsibility. currencyCode is exposed as data-currency-code so the
    // consumer can pass it to Intl.NumberFormat. It is REQUIRED and never
    // defaulted: the component does not pick a currency.
    //
    // Props:
    //   class        — string, optional. CSS class name.
    //   label        — string, required. Accessible name via aria-label.
    //   value        — number | undefined, bindable. Parsed numeric value.
    //   currencyCode — string, required, no default. ISO 4217 currency code.
    //   min, max     — number, optional. Constraints, not enforced clamping.
    //   required, disabled — boolean, default false.
    //   ...restProps — spread onto the <input>.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles; no locale formatting baked in
    //   - Never default currencyCode (AGENTS/internationalization.md)

    let {
        class: className = "",
        label,
        value = $bindable(undefined),
        currencyCode,
        min = undefined,
        max = undefined,
        required = false,
        disabled = false,
        ...restProps
    }: {
        class?: string;
        label: string;
        value?: number | undefined;
        currencyCode: string;
        min?: number;
        max?: number;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    function oninput(event: Event) {
        const raw = (event.currentTarget as HTMLInputElement).value.trim();
        if (raw === "") {
            value = undefined;
            return;
        }
        const parsed = Number(raw);
        value = Number.isNaN(parsed) ? undefined : parsed;
    }
</script>

<!-- CurrencyInput.svelte -->
<input
    class={`currency-input ${className}`}
    type="text"
    inputmode="decimal"
    aria-label={label}
    data-currency-code={currencyCode}
    value={value === undefined ? "" : String(value)}
    {min}
    {max}
    {required}
    {disabled}
    {oninput}
    {...restProps}
/>
