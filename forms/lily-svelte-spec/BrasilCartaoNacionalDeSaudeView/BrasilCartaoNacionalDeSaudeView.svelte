<script lang="ts">
    // BrasilCartaoNacionalDeSaudeView component
    //
    // A headless display component for showing Brazil's
    // Cartão Nacional de Saúde (CNS) in a read-only format.
    // Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <BrasilCartaoNacionalDeSaudeView label="Cartão Nacional de Saúde (CNS)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/CPF_number

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label?: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- BrasilCartaoNacionalDeSaudeView.svelte -->
<span
    class={`brasil-cartao-nacional-de-saude-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
