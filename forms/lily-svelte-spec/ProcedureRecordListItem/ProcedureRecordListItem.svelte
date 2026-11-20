<script lang="ts">
    // ProcedureRecordListItem component
    //
    // One procedure in a procedure record list, with its status and when it was performed (tasks.md P28-T3, spec/healthcare-ui). Every word is the consumer's;
    // each status is text as well as a data-* attribute, and a status without words raises a development warning.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   subjectLabel: string (optional) — whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first
    //   procedure: string (required) — the procedure; never truncated
    //   status: "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed" | "entered-in-error" | "unknown" (optional) — FHIR Procedure status; rendered as data-status
    //   statusLabel: string (optional; required when status is set) — the status in words
    //   performed: string (optional) — when it was performed, for <time datetime>
    //   performedLabel: string (optional) — that date as the consumer writes it; the <time> shows only when set
    //   children: slot (optional) — anything else, such as a link to the full record
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // References:
    //   - FHIR Procedure: https://hl7.org/fhir/R4/procedure.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        subjectLabel,
        procedure,
        status,
        statusLabel,
        performed,
        performedLabel,
        children,
        ...restProps
    }: {
        /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
        subjectLabel?: string;
        procedure: string;
        status?:
            | "preparation"
            | "in-progress"
            | "not-done"
            | "on-hold"
            | "stopped"
            | "completed"
            | "entered-in-error"
            | "unknown";
        statusLabel?: string;
        performed?: string;
        performedLabel?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (status)
            warnMissingProp(
                "ProcedureRecordListItem",
                "statusLabel",
                statusLabel,
                "a status needs words a person can read, never a code alone.",
            );
    });
</script>

<!-- ProcedureRecordListItem.svelte -->
<li
    class={`procedure-record-list-item ${className}`}
    data-status={status}
    {...restProps}
>
    {#if subjectLabel}<span class="procedure-record-list-item-subject">{subjectLabel}</span
        >{" "}{/if}
    <span class="procedure-record-list-item-procedure">{procedure}</span>
    {#if statusLabel}{" "}<span class="procedure-record-list-item-status">{statusLabel}</span>{/if}
    {#if performedLabel}{" "}<time
            class="procedure-record-list-item-performed"
            datetime={performed}>{performedLabel}</time
        >{/if}
    {@render children?.()}
</li>
