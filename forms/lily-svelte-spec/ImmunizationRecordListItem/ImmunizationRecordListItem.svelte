<script lang="ts">
    // ImmunizationRecordListItem component
    //
    // One immunization in an immunization record list, with vaccine, date, dose and status (tasks.md P28-T3, spec/healthcare-ui). Every word is the consumer's;
    // each status is text as well as a data-* attribute, and a status without words raises a development warning.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   vaccine: string (required) — the vaccine given; never truncated
    //   occurrence: string (optional) — when it was given, for <time datetime>
    //   occurrenceLabel: string (optional) — that date as the consumer writes it; the <time> shows only when set
    //   doseNumberLabel: string (optional) — the dose in words ("Dose 2 of 2")
    //   status: "completed" | "entered-in-error" | "not-done" (optional) — FHIR Immunization status; rendered as data-status
    //   statusLabel: string (optional; required when status is set) — the status in words
    //   lotNumber: string (optional) — the vaccine's lot number
    //   children: slot (optional) — anything else, such as a link to the full record
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // References:
    //   - FHIR Immunization: https://hl7.org/fhir/R4/immunization.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        vaccine,
        occurrence,
        occurrenceLabel,
        doseNumberLabel,
        status,
        statusLabel,
        lotNumber,
        children,
        ...restProps
    }: {
        vaccine: string;
        occurrence?: string;
        occurrenceLabel?: string;
        doseNumberLabel?: string;
        status?: "completed" | "entered-in-error" | "not-done";
        statusLabel?: string;
        lotNumber?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (status)
            warnMissingProp(
                "ImmunizationRecordListItem",
                "statusLabel",
                statusLabel,
                "a status needs words a person can read, never a code alone.",
            );
    });
</script>

<!-- ImmunizationRecordListItem.svelte -->
<li
    class={`immunization-record-list-item ${className}`}
    data-status={status}
    {...restProps}
>
    <span class="immunization-record-list-item-vaccine">{vaccine}</span>
    {#if occurrenceLabel}{" "}<time
            class="immunization-record-list-item-occurrence"
            datetime={occurrence}>{occurrenceLabel}</time
        >{/if}
    {#if doseNumberLabel}{" "}<span class="immunization-record-list-item-dose-number"
            >{doseNumberLabel}</span
        >{/if}
    {#if statusLabel}{" "}<span class="immunization-record-list-item-status">{statusLabel}</span
        >{/if}
    {#if lotNumber}{" "}<span class="immunization-record-list-item-lot-number">{lotNumber}</span
        >{/if}
    {@render children?.()}
</li>
