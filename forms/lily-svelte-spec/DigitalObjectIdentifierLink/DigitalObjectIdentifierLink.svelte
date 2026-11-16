<script lang="ts">
    // DigitalObjectIdentifierLink component
    //
    // A link to a Digital Object Identifier (DOI) through the https://doi.org/ resolver. Renders an <a>
    // with the `digital-object-identifier-link` hook; the text is the children, or the DOI itself when
    // none are given.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   doi — string, required. The identifier, for example "10.1000/xyz123".
    //   children — Snippet, optional. The link text; the DOI when omitted.
    //   ...restProps — additional HTML attributes spread onto the root <a>.
    //
    // Syntax:
    //   <DigitalObjectIdentifierLink doi="10.1000/xyz123" />
    //
    // Examples:
    //   <DigitalObjectIdentifierLink doi="10.1000/xyz123">Read the paper</DigitalObjectIdentifierLink>
    //
    // Keyboard:
    //   - Tab: moves focus onto the link
    //   - Enter: follows the link (native browser behaviour)
    //
    // Accessibility:
    //   - A native <a href>; the DOI or the children are the accessible name
    //   - rel="noopener noreferrer" is always set; restProps can override it
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Worldwide: the DOI resolver is an international registry, not a national service
    //   - The href is built from `doi` without validation; pass the bare identifier, not a URL
    //
    // References:
    //   - DOI Handbook: https://www.doi.org/the-identifier/resources/handbook
    //   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        doi,
        children = undefined,
        ...restProps
    }: {
        /** The Digital Object Identifier, e.g. "10.1000/xyz123". */
        doi: string;
        /** Link display text; the DOI when omitted. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DigitalObjectIdentifierLink.svelte -->
<a
    class={`digital-object-identifier-link ${className}`}
    href={`https://doi.org/${doi}`}
    rel="noopener noreferrer"
    {...restProps}
>
    {#if children}{@render children()}{:else}{doi}{/if}
</a>
