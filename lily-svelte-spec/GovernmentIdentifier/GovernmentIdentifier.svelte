<script lang="ts">
    // GovernmentIdentifier component
    //
    // A headless `<section>` that identifies the parent agency of a government
    // website, including optional logo, the REQUIRED agency name, optional
    // description, and a nested `<nav>` for required links provided as
    // children. Inspired by the USWDS Identifier component.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label naming the section.
    //   agencyName — string, REQUIRED. Parent agency name.
    //   agencyHref — string, optional. When provided, agency name links to it.
    //   logoUrl — string, optional. Agency logo src.
    //   logoAlt — string, optional. Agency logo alt text.
    //   description — string, optional. Agency description.
    //   children — Snippet, optional. Required-links nav content.
    //   ...restProps — additional HTML attributes spread onto the <section>.
    //
    // Accessibility:
    //   - <section> with aria-label is a labelled landmark
    //   - Nested <nav> with aria-label names the required-links navigation
    //   - Logo image alt text is consumer-supplied
    //
    // Internationalization:
    //   - All text comes through props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - label and agencyName are REQUIRED

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        agencyName,
        agencyHref = undefined,
        logoUrl = undefined,
        logoAlt = "",
        description = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Section aria-label (REQUIRED) */
        label: string;
        /** Parent agency name (REQUIRED) */
        agencyName: string;
        /** Optional href for the agency name */
        agencyHref?: string;
        /** Optional agency logo src */
        logoUrl?: string;
        /** Optional agency logo alt text */
        logoAlt?: string;
        /** Optional agency description text */
        description?: string;
        /** Optional required-links nav content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GovernmentIdentifier.svelte -->
<section
    class={`government-identifier ${className}`}
    aria-label={label}
    {...restProps}
>
    <div class="government-identifier-masthead">
        {#if logoUrl}
            <img
                class="government-identifier-logo"
                src={logoUrl}
                alt={logoAlt}
            />
        {/if}
        <p class="government-identifier-agency">
            {#if agencyHref}
                <a href={agencyHref}>{agencyName}</a>
            {:else}
                <span>{agencyName}</span>
            {/if}
        </p>
        {#if description}
            <p class="government-identifier-description">{description}</p>
        {/if}
    </div>
    {#if children}
        <nav
            class="government-identifier-links"
            aria-label={label}
        >
            {@render children?.()}
        </nav>
    {/if}
</section>
