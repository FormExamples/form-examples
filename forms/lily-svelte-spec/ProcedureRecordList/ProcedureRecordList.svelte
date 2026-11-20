<script lang="ts">
    // ProcedureRecordList component
    //
    // A list of a patient's procedures, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). "None known", "not recorded",
    // "unavailable", "omitted" and "not applicable" are different facts, and an empty list could be read as any of them, so the status is
    // required and, for any status but "known", shown as the list's one item.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as data-status
    //   statusLabel: string (required) — the status in words; names the list, and is its one item unless status is known
    //   label: string (optional) — the accessible name, when it should differ from statusLabel
    //   children: slot (optional) — procedure-record-list-item items
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // References:
    //   - FHIR Procedure: https://hl7.org/fhir/R4/procedure.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        status,
        statusLabel,
        label,
        children,
        ...restProps
    }: {
        status:
            "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
        statusLabel: string;
        label?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        warnMissingProp(
            "ProcedureRecordList",
            "status",
            status,
            "A procedure record list must say whether procedures are known, none known, not recorded, unavailable, omitted or not applicable.",
        );
        warnMissingProp(
            "ProcedureRecordList",
            "statusLabel",
            statusLabel,
            "The status needs words a person can read.",
        );
    });
</script>

<!-- ProcedureRecordList.svelte -->
<ul
    class={`procedure-record-list ${className}`}
    data-status={status}
    aria-label={label ?? statusLabel}
    {...restProps}
>
    {#if status !== "known"}<li class="procedure-record-list-status">{statusLabel}</li>{/if}
    {@render children?.()}
</ul>
