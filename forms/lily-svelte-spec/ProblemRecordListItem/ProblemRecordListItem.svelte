<script lang="ts">
    // ProblemRecordListItem component
    //
    // One problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution (tasks.md P28-T3, spec/healthcare-ui). Every word is the consumer's;
    // each status is text as well as a data-* attribute, and a status without words raises a development warning.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   subjectLabel: string (optional) — whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first
    //   condition: string (required) — the problem or condition; never truncated
    //   clinicalStatus: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved" (optional) — FHIR Condition clinicalStatus; rendered as data-clinical-status
    //   clinicalStatusLabel: string (optional; required when clinicalStatus is set) — the clinicalStatus in words
    //   verificationStatus: "unconfirmed" | "provisional" | "differential" | "confirmed" | "refuted" | "entered-in-error" (optional) — FHIR Condition verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as data-verification-status
    //   verificationStatusLabel: string (optional; required when verificationStatus is set) — the verificationStatus in words
    //   severityLabel: string (optional) — the severity in words
    //   onset: string (optional) — when it began, for <time datetime>
    //   onsetLabel: string (optional) — that date as the consumer writes it; the <time> shows only when set
    //   abatement: string (optional) — when it resolved, for <time datetime>
    //   abatementLabel: string (optional) — that date as the consumer writes it; the <time> shows only when set
    //   children: slot (optional) — anything else, such as a link to the full record
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // References:
    //   - FHIR Condition: https://hl7.org/fhir/R4/condition.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        subjectLabel,
        condition,
        clinicalStatus,
        clinicalStatusLabel,
        verificationStatus,
        verificationStatusLabel,
        severityLabel,
        onset,
        onsetLabel,
        abatement,
        abatementLabel,
        children,
        ...restProps
    }: {
        /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
        subjectLabel?: string;
        condition: string;
        clinicalStatus?:
            "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved";
        clinicalStatusLabel?: string;
        verificationStatus?:
            | "unconfirmed"
            | "provisional"
            | "differential"
            | "confirmed"
            | "refuted"
            | "entered-in-error";
        verificationStatusLabel?: string;
        severityLabel?: string;
        onset?: string;
        onsetLabel?: string;
        abatement?: string;
        abatementLabel?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (clinicalStatus)
            warnMissingProp(
                "ProblemRecordListItem",
                "clinicalStatusLabel",
                clinicalStatusLabel,
                "a status needs words a person can read, never a code alone.",
            );
        if (verificationStatus)
            warnMissingProp(
                "ProblemRecordListItem",
                "verificationStatusLabel",
                verificationStatusLabel,
                "a status needs words a person can read, never a code alone.",
            );
    });
</script>

<!-- ProblemRecordListItem.svelte -->
<li
    class={`problem-record-list-item ${className}`}
    data-clinical-status={clinicalStatus}
    data-verification-status={verificationStatus}
    {...restProps}
>
    {#if subjectLabel}<span class="problem-record-list-item-subject">{subjectLabel}</span>{" "}{/if}
    <span class="problem-record-list-item-condition">{condition}</span>
    {#if clinicalStatusLabel}{" "}<span class="problem-record-list-item-clinical-status"
            >{clinicalStatusLabel}</span
        >{/if}
    {#if verificationStatusLabel}{" "}<span class="problem-record-list-item-verification-status"
            >{verificationStatusLabel}</span
        >{/if}
    {#if severityLabel}{" "}<span class="problem-record-list-item-severity">{severityLabel}</span
        >{/if}
    {#if onsetLabel}{" "}<time
            class="problem-record-list-item-onset"
            datetime={onset}>{onsetLabel}</time
        >{/if}
    {#if abatementLabel}{" "}<time
            class="problem-record-list-item-abatement"
            datetime={abatement}>{abatementLabel}</time
        >{/if}
    {@render children?.()}
</li>
