<script lang="ts">
    // MedicationRecordListItem component
    //
    // One medicine in a medication record list, with its status and when it applies (tasks.md P28-T3, spec/healthcare-ui). Every word is the consumer's;
    // each status is text as well as a data-* attribute, and a status without words raises a development warning.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children: slot — the medicine, usually a MedicationView
    //   status: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" | "unknown" | "not-taken" (optional) — FHIR MedicationStatement status; rendered as data-status
    //   statusLabel: string (optional; required when status is set) — the status in words
    //   effective: string (optional) — when the medicine applies, for <time datetime>
    //   effectiveLabel: string (optional) — that date as the consumer writes it; the <time> shows only when set
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // References:
    //   - FHIR MedicationStatement: https://hl7.org/fhir/R4/medicationstatement.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        status,
        statusLabel,
        effective,
        effectiveLabel,
        children,
        ...restProps
    }: {
        status?:
            | "active"
            | "completed"
            | "entered-in-error"
            | "intended"
            | "stopped"
            | "on-hold"
            | "unknown"
            | "not-taken";
        statusLabel?: string;
        effective?: string;
        effectiveLabel?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (status)
            warnMissingProp(
                "MedicationRecordListItem",
                "statusLabel",
                statusLabel,
                "a status needs words a person can read, never a code alone.",
            );
    });
</script>

<!-- MedicationRecordListItem.svelte -->
<li
    class={`medication-record-list-item ${className}`}
    data-status={status}
    {...restProps}
>
    {@render children?.()}
    {#if statusLabel}{" "}<span class="medication-record-list-item-status">{statusLabel}</span>{/if}
    {#if effectiveLabel}{" "}<time
            class="medication-record-list-item-effective"
            datetime={effective}>{effectiveLabel}</time
        >{/if}
</li>
