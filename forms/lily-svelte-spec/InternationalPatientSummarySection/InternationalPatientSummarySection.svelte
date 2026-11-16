<script lang="ts">
    // InternationalPatientSummarySection component
    //
    // One section of an International Patient Summary (HL7 FHIR IPS, ISO 27269): a <section> named by its heading, carrying the
    // section's key, LOINC code, status and whether the IPS requires it, as data. Its entries are the consumer's (a record list,
    // a data table); its status is never blank, and for any status but "known" the consumer's words are shown under the heading.
    // The author's narrative, when given, sits in a <details> after the entries.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   section — string (required). The IPS section key, such as "allergies" (see ips-sections.ts); data-section.
    //   heading — string (required). The section's heading, the consumer's words.
    //   headingLevel — 2 to 6, default 2.
    //   status — "known" | "none-known" | "not-recorded" | "unavailable" | "omitted", default "known"; data-status.
    //   statusLabel — string. The status in words; required for any status but "known".
    //   code — string, optional. The LOINC code; default the IPS code for the key; data-code.
    //   required — boolean, optional. Default whether the IPS requires the section; data-required.
    //   id — string, optional. Default {idPrefix}-{section}, which the contents links use.
    //   idPrefix — string, default "international-patient-summary"; the same as its summary's.
    //   narrative — Snippet, optional. The author's narrative (sanitised by the consumer), in a <details>.
    //   narrativeLabel — string. The <details> summary; required with narrative.
    //   narrativeOpen — boolean, default false. Open it when the section has no structured entries.
    //   children — Snippet, optional. The section's entries.
    //   ...restProps — additional HTML attributes spread onto the <section>.
    //
    // References:
    //   - IPS Composition sections: https://hl7.org/fhir/uv/ips/Structure-of-the-International-Patient-Summary.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";
    import { ipsSectionCode, ipsSectionId, ipsSectionIsRequired } from "../ips-sections";
    import type { IpsSectionStatus } from "../ips-sections";

    let {
        class: className = "",
        section,
        heading,
        headingLevel = 2,
        status = "known",
        statusLabel = undefined,
        code = undefined,
        required = undefined,
        id = undefined,
        idPrefix = undefined,
        narrative = undefined,
        narrativeLabel = undefined,
        narrativeOpen = false,
        children,
        ...restProps
    }: {
        section: string;
        heading: string;
        headingLevel?: 2 | 3 | 4 | 5 | 6;
        status?: IpsSectionStatus;
        statusLabel?: string;
        code?: string;
        required?: boolean;
        id?: string;
        idPrefix?: string;
        narrative?: Snippet;
        narrativeLabel?: string;
        narrativeOpen?: boolean;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const sectionId = $derived(ipsSectionId(section, id, idPrefix));
    const headingId = $derived(`${sectionId}-heading`);
    const sectionCode = $derived(code ?? ipsSectionCode(section));
    const isRequired = $derived(required ?? ipsSectionIsRequired(section));

    $effect(() => {
        warnMissingProp(
            "InternationalPatientSummarySection",
            "heading",
            heading,
            "A section needs a heading.",
        );
        if (status !== "known")
            warnMissingProp(
                "InternationalPatientSummarySection",
                "statusLabel",
                statusLabel,
                "A section that is not known must say why, in words.",
            );
        if (narrative)
            warnMissingProp(
                "InternationalPatientSummarySection",
                "narrativeLabel",
                narrativeLabel,
                "The narrative's disclosure needs a summary.",
            );
    });
</script>

<!-- InternationalPatientSummarySection.svelte -->
<section
    class={`international-patient-summary-section ${className}`}
    id={sectionId}
    aria-labelledby={headingId}
    data-section={section}
    data-code={sectionCode}
    data-status={status}
    data-required={isRequired ? "true" : undefined}
    {...restProps}
>
    <svelte:element
        this={`h${headingLevel}`}
        id={headingId}
        class="international-patient-summary-section-heading">{heading}</svelte:element
    >
    {#if status !== "known" && statusLabel}
        <p class="international-patient-summary-section-status">{statusLabel}</p>
    {/if}
    {@render children?.()}
    {#if narrative}
        <details
            class="international-patient-summary-section-narrative"
            open={narrativeOpen}
        >
            <summary>{narrativeLabel}</summary>
            {@render narrative()}
        </details>
    {/if}
</section>
