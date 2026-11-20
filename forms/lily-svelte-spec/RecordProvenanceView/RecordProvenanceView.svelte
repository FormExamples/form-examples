<script lang="ts">
    // RecordProvenanceView component
    //
    // Who recorded a record, where it came from, when, and whether it is signed or sent, in the consumer's words (tasks.md
    // P29-T9, spec/lessons/openehr item 10, spec/lessons/zoblocks item 5, spec/lessons/openmrs item 6). Its states are
    // data-* attributes for CSS and words for people; a state without words raises a development warning, so an unsigned,
    // amended or unsent record never reads as a signed one. The signature and sync states come first. It decides nothing:
    // every state and word is the consumer's.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. hidden text naming the provenance ("Provenance"), when no visible caption does.
    //   attestation — "signed" | "pending" | "unsigned" | "amended" | "deleted", optional. whether the record is signed: "signed", "pending" (awaiting a signature), "unsigned", "amended" or "deleted"; rendered as data-attestation.
    //   attestationLabel — string, optional. that state in words; required with attestation.
    //   sync — "pending" | "failed", optional. "pending" (saved on this device, not yet sent) or "failed" (could not be sent); rendered as data-sync.
    //   syncLabel — string, optional. that state in words; required with sync.
    //   source — string, optional. where the record came from, as the consumer's code ("clinic", "device", "patient-reported", "external", "extracted"); rendered as data-source.
    //   sourceLabel — string, optional. that source in words ("From the patient's blood pressure monitor").
    //   authorLabel — string, optional. who wrote or recorded it, in the consumer's words ("Dr A Patel").
    //   observed — string, optional. when the thing recorded happened, as an ISO 8601 date or date and time.
    //   observedLabel — string, optional. that time as the consumer writes it; the <time> shows only when set.
    //   recorded — string, optional. when it was recorded, as an ISO 8601 date or date and time.
    //   recordedLabel — string, optional. that time as the consumer writes it; the <time> shows only when set.
    //   versionLabel — string, optional. the version in words ("Version 3").
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <RecordProvenanceView attestation="pending" attestationLabel="Awaiting signature" authorLabel="Dr A Patel" />
    //
    // References:
    //   - openEHR AUDIT_DETAILS, ATTESTATION, FEEDER_AUDIT: https://specifications.openehr.org/releases/RM/latest/common.html
    //   - FHIR Provenance: https://hl7.org/fhir/provenance.html
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        label,
        attestation,
        attestationLabel,
        sync,
        syncLabel,
        source,
        sourceLabel,
        authorLabel,
        observed,
        observedLabel,
        recorded,
        recordedLabel,
        versionLabel,
        ...restProps
    }: {
        label?: string;
        attestation?: "signed" | "pending" | "unsigned" | "amended" | "deleted";
        attestationLabel?: string;
        sync?: "pending" | "failed";
        syncLabel?: string;
        source?: string;
        sourceLabel?: string;
        authorLabel?: string;
        observed?: string;
        observedLabel?: string;
        recorded?: string;
        recordedLabel?: string;
        versionLabel?: string;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (attestation)
            warnMissingProp(
                "RecordProvenanceView",
                "attestationLabel",
                attestationLabel,
                "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
            );
        if (sync)
            warnMissingProp(
                "RecordProvenanceView",
                "syncLabel",
                syncLabel,
                "a provenance state needs words a person can read, so an unsigned or unsent record never reads as a signed one.",
            );
    });
</script>

<!-- RecordProvenanceView.svelte -->
<span
    class={`record-provenance-view ${className}`}
    data-attestation={attestation}
    data-sync={sync}
    data-source={source}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span
        >{/if}{#if attestationLabel}<span class="record-provenance-view-attestation"
            >{attestationLabel}</span
        >{" "}{/if}{#if syncLabel}<span class="record-provenance-view-sync">{syncLabel}</span
        >{" "}{/if}{#if sourceLabel}<span class="record-provenance-view-source">{sourceLabel}</span
        >{" "}{/if}{#if authorLabel}<span class="record-provenance-view-author">{authorLabel}</span
        >{" "}{/if}{#if observedLabel}<time
            class="record-provenance-view-observed"
            datetime={observed}>{observedLabel}</time
        >{" "}{/if}{#if recordedLabel}<time
            class="record-provenance-view-recorded"
            datetime={recorded}>{recordedLabel}</time
        >{" "}{/if}{#if versionLabel}<span class="record-provenance-view-version"
            >{versionLabel}</span
        >{" "}{/if}</span
>
