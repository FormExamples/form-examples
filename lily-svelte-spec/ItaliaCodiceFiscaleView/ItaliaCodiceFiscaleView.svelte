<script lang="ts">
    // ItaliaCodiceFiscaleView component
    //
    // A headless display component for showing Italy's
    // Codice fiscale (CF) in a read-only format.
    // Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <ItaliaCodiceFiscaleView label="Italian Fiscal Code" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Italian_fiscal_code

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ItaliaCodiceFiscaleView.svelte -->
<span
    class={`italia-codice-fiscale-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
