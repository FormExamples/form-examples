<script lang="ts">
    // MalaysiaKadPengenalanView component
    //
    // A headless display component for showing Malaysia's
    // MyKad Number (NRIC) in a read-only format.
    // Format: Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MalaysiaKadPengenalanView label="MyKad Number (NRIC)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/MyKad

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

<!-- MalaysiaKadPengenalanView.svelte -->
<span
    class={`malaysia-kad-pengenalan-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
