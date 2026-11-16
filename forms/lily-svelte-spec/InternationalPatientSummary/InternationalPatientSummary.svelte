<script lang="ts">
    // InternationalPatientSummary component
    //
    // An International Patient Summary (HL7 FHIR IPS, ISO 27269) laid out for a clinician: an <article> holding the patient
    // banner, a contents navigation, the sections, and the document's details. Structure only: the consumer reads the FHIR
    // document and renders each section's entries with the record lists; Lily parses nothing.
    //
    // The root takes the sections as plain data too, so it can do the one thing children cannot: show a gap. The IPS requires
    // the medication summary, allergies and problem list. When the consumer's list lacks one, the root adds that section, with
    // the consumer's heading and omittedLabel ("Section missing from document"), and a contents link to it, after the given
    // sections. A missing required section is never silently absent.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string (required). The article's accessible name.
    //   sections — { key, heading, status?, id? }[], default []. The sections the consumer renders, in document order.
    //   requiredHeadings — { medications, allergies, problems } (required). Headings for an added, missing required section.
    //   omittedLabel — string (required). The words an added section shows, such as "Section missing from document".
    //   contentsLabel — string, optional. Names the contents navigation; without it there is none.
    //   headingLevel — 2 to 6, default 2. For the added sections.
    //   idPrefix — string, default "international-patient-summary". Section ids are {idPrefix}-{key}; give each summary on a
    //     page its own, and pass the same idPrefix to its sections.
    //   banner — Snippet, optional. The patient banner composition (see the patient banner pattern).
    //   details — Snippet, optional. The document's details (title, date, authors, custodian, IPS version).
    //   children — Snippet, optional. The InternationalPatientSummarySection elements, in document order.
    //   ...restProps — additional HTML attributes spread onto the <article>.
    //
    // References:
    //   - IPS IG: https://hl7.org/fhir/uv/ips/
    //   - ISO 27269:2025 International Patient Summary
    import type { Snippet } from "svelte";
    import { warnMissingName, warnMissingProp } from "../dev-warning";
    import { ipsContents } from "../ips-sections";
    import type { IpsSectionEntry } from "../ips-sections";
    import InternationalPatientSummarySection from "../InternationalPatientSummarySection/InternationalPatientSummarySection.svelte";

    let {
        class: className = "",
        label,
        sections = [],
        requiredHeadings,
        omittedLabel,
        contentsLabel = undefined,
        headingLevel = 2,
        idPrefix = undefined,
        banner = undefined,
        details = undefined,
        children,
        ...restProps
    }: {
        label: string;
        sections?: IpsSectionEntry[];
        requiredHeadings: { medications: string; allergies: string; problems: string };
        omittedLabel: string;
        contentsLabel?: string;
        headingLevel?: 2 | 3 | 4 | 5 | 6;
        idPrefix?: string;
        banner?: Snippet;
        details?: Snippet;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const contents = $derived(ipsContents(sections, requiredHeadings ?? {}, idPrefix));
    const added = $derived(contents.filter((c) => c.added));

    $effect(() => {
        warnMissingName(
            "InternationalPatientSummary",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        );
        warnMissingProp(
            "InternationalPatientSummary",
            "omittedLabel",
            omittedLabel,
            "A missing required section must be shown in words.",
        );
        warnMissingProp(
            "InternationalPatientSummary",
            "requiredHeadings",
            requiredHeadings,
            "A missing required section needs a heading.",
        );
    });
</script>

<!-- InternationalPatientSummary.svelte -->
<article
    class={`international-patient-summary ${className}`}
    aria-label={label}
    {...restProps}
>
    {#if banner}
        <div class="international-patient-summary-banner">{@render banner()}</div>
    {/if}
    {#if contentsLabel}
        <nav
            class="international-patient-summary-contents"
            aria-label={contentsLabel}
        >
            <ol>
                {#each contents as entry (entry.id)}
                    <li
                        data-section={entry.key}
                        data-status={entry.status}
                    >
                        <a href={`#${entry.id}`}>{entry.heading}</a>
                    </li>
                {/each}
            </ol>
        </nav>
    {/if}
    <div class="international-patient-summary-sections">
        {@render children?.()}
        {#each added as entry (entry.id)}
            <InternationalPatientSummarySection
                section={entry.key}
                id={entry.id}
                heading={entry.heading}
                {headingLevel}
                status="omitted"
                statusLabel={omittedLabel}
            />
        {/each}
    </div>
    {#if details}
        <div class="international-patient-summary-details">{@render details()}</div>
    {/if}
</article>
