<script lang="ts">
    // AddressInput component
    //
    // A group for the parts of a postal address (line 1, line 2, town, postcode, ...). Renders a <div
    // role="group"> with the `address-input` hook; the individual fields are the consumer's inputs, since
    // address shapes differ by country.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <AddressInput label="…">…</AddressInput>
    //
    // Examples:
    //   <AddressInput label="Delivery address"><TextInput label="Line 1" /><TextInput label="Postcode" /></AddressInput>
    //
    // Keyboard:
    //   - Tab moves between the inputs inside the group (native)
    //
    // Accessibility:
    //   - role="group" with aria-label names the set of fields
    //   - Use autocomplete tokens (street-address, postal-code) on the inner inputs
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Worldwide: ships no country-specific fields; the consumer chooses them
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
    import { warnMissingName } from "../dev-warning";

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "AddressInput",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- AddressInput.svelte -->
<div
    class={`address-input ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
