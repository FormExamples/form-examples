<script lang="ts">
    // AllergyRecordListItem component
    //
    // One allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status (tasks.md P28-T3, spec/healthcare-ui). Every word is the consumer's;
    // each status is text as well as a data-* attribute, and a status without words raises a development warning.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   substance: string (required) — what the patient reacts to; never truncated
    //   reaction: string (optional) — the manifestation
    //   severity: "mild" | "moderate" | "severe" (optional) — the reaction's severity (FHIR reaction.severity); rendered as data-severity
    //   severityLabel: string (optional; required when severity is set) — the severity in words
    //   criticality: "low" | "high" | "unable-to-assess" (optional) — the risk of a future reaction (FHIR criticality), not the severity of a past one; rendered as data-criticality
    //   criticalityLabel: string (optional; required when criticality is set) — the criticality in words
    //   clinicalStatus: "active" | "inactive" | "resolved" (optional) — FHIR clinicalStatus; rendered as data-clinical-status
    //   clinicalStatusLabel: string (optional; required when clinicalStatus is set) — the clinicalStatus in words
    //   verificationStatus: "unconfirmed" | "presumed" | "confirmed" | "refuted" | "entered-in-error" (optional) — FHIR verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as data-verification-status
    //   verificationStatusLabel: string (optional; required when verificationStatus is set) — the verificationStatus in words
    //   typeLabel: string (optional) — allergy or intolerance, in words (FHIR type)
    //   categoryLabel: string (optional) — food, medication, environment or biologic, in words (FHIR category)
    //   updated: string (optional) — when the record was last updated
    //   updatedLabel: string (optional) — that date as the consumer writes it; the <time> shows only when set
    //   children: slot (optional) — anything else, such as a link to the full record
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // References:
    //   - FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        substance,
        reaction,
        severity,
        severityLabel,
        criticality,
        criticalityLabel,
        clinicalStatus,
        clinicalStatusLabel,
        verificationStatus,
        verificationStatusLabel,
        typeLabel,
        categoryLabel,
        updated,
        updatedLabel,
        children,
        ...restProps
    }: {
        substance: string;
        reaction?: string;
        severity?: "mild" | "moderate" | "severe";
        severityLabel?: string;
        criticality?: "low" | "high" | "unable-to-assess";
        criticalityLabel?: string;
        clinicalStatus?: "active" | "inactive" | "resolved";
        clinicalStatusLabel?: string;
        verificationStatus?:
            "unconfirmed" | "presumed" | "confirmed" | "refuted" | "entered-in-error";
        verificationStatusLabel?: string;
        typeLabel?: string;
        categoryLabel?: string;
        updated?: string;
        updatedLabel?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (severity)
            warnMissingProp(
                "AllergyRecordListItem",
                "severityLabel",
                severityLabel,
                "a status needs words a person can read, never a code alone.",
            );
        if (criticality)
            warnMissingProp(
                "AllergyRecordListItem",
                "criticalityLabel",
                criticalityLabel,
                "a status needs words a person can read, never a code alone.",
            );
        if (clinicalStatus)
            warnMissingProp(
                "AllergyRecordListItem",
                "clinicalStatusLabel",
                clinicalStatusLabel,
                "a status needs words a person can read, never a code alone.",
            );
        if (verificationStatus)
            warnMissingProp(
                "AllergyRecordListItem",
                "verificationStatusLabel",
                verificationStatusLabel,
                "a status needs words a person can read, never a code alone.",
            );
    });
</script>

<!-- AllergyRecordListItem.svelte -->
<li
    class={`allergy-record-list-item ${className}`}
    data-severity={severity}
    data-criticality={criticality}
    data-clinical-status={clinicalStatus}
    data-verification-status={verificationStatus}
    {...restProps}
>
    <span class="allergy-record-list-item-substance">{substance}</span>
    {#if reaction}{" "}<span class="allergy-record-list-item-reaction">{reaction}</span>{/if}
    {#if severityLabel}{" "}<span class="allergy-record-list-item-severity">{severityLabel}</span
        >{/if}
    {#if criticalityLabel}{" "}<span class="allergy-record-list-item-criticality"
            >{criticalityLabel}</span
        >{/if}
    {#if clinicalStatusLabel}{" "}<span class="allergy-record-list-item-clinical-status"
            >{clinicalStatusLabel}</span
        >{/if}
    {#if verificationStatusLabel}{" "}<span class="allergy-record-list-item-verification-status"
            >{verificationStatusLabel}</span
        >{/if}
    {#if typeLabel}{" "}<span class="allergy-record-list-item-type">{typeLabel}</span>{/if}
    {#if categoryLabel}{" "}<span class="allergy-record-list-item-category">{categoryLabel}</span
        >{/if}
    {#if updatedLabel}{" "}<time
            class="allergy-record-list-item-updated"
            datetime={updated}>{updatedLabel}</time
        >{/if}
    {@render children?.()}
</li>
