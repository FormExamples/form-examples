<script lang="ts">
    // Blockquote component
    //
    // A block-level quotation with optional source citation.
    // Renders a native HTML <blockquote> element. When `citationText` is
    // provided, it is rendered inside a <footer> after the quoted content.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   cite — string, optional. URL of the source (rendered as the `cite` attribute).
    //   citationText — string, optional. Visible attribution text e.g. "— Author Name, Source".
    //   label — string, optional. aria-label override.
    //   children — Snippet, optional. The quote content.
    //   ...restProps — additional HTML attributes spread onto the <blockquote>.
    //
    // Syntax:
    //   <Blockquote cite="https://example.com" citationText="— Jane Doe">
    //     {#snippet children()}<p>Quoted text.</p>{/snippet}
    //   </Blockquote>
    //
    // Accessibility:
    //   - Native <blockquote> semantics
    //   - Optional aria-label override
    //
    // Internationalization:
    //   - All visible text comes through props/children
    //
    // Claude rules:
    //   - Headless: no styles
    //
    // References:
    //   - HTML <blockquote>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        cite = undefined,
        citationText = undefined,
        label = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Consumer CSS class appended to base class */
        class?: string;
        /** URL of the source (cite attribute) */
        cite?: string;
        /** Visible attribution text */
        citationText?: string;
        /** aria-label override */
        label?: string;
        /** Quote content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Blockquote.svelte -->
<blockquote
    class={`blockquote ${className}`}
    {cite}
    aria-label={label}
    {...restProps}
>
    {#if children}{@render children?.()}{/if}
    {#if citationText}
        <footer class="blockquote-citation">{citationText}</footer>
    {/if}
</blockquote>
