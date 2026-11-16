<script lang="ts">
    // MagyarorszagTajSzamView component
    //
    // A headless display component for showing Hungary's
    // Társadalombiztosítási Azonosító Jel (TAJ) in a read-only format.
    // Format: Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an algorithm unique to Hungary, distinct from Luhn.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MagyarorszagTajSzamView label="Társadalombiztosítási Azonosító Jel (TAJ)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel

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

<!-- MagyarorszagTajSzamView.svelte -->
<span
    class={`magyarorszag-taj-szam-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
