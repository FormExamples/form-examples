<script lang="ts">
    // RecordList component
    //
    // A list of records from one section of a patient's record, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). "None known", "not recorded",
    // "unavailable" and "omitted" are different facts, and an empty list could be read as any of them, so the status is
    // required and, for any status but "known", shown as the list's one item.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" (required) — rendered as data-status
    //   statusLabel: string (required) — the status in words; names the list, and is its one item unless status is known
    //   label: string (optional) — the accessible name, when it should differ from statusLabel
    //   children: slot (optional) — record-list-item items
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // References:
    //   - IPS Composition section: https://hl7.org/fhir/uv/ips/StructureDefinition-Composition-uv-ips.html
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
        status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted";
        statusLabel: string;
        label?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        warnMissingProp(
            "RecordList",
            "status",
            status,
            "A record list must say whether records are known, none known, not recorded, unavailable or omitted.",
        );
        warnMissingProp(
            "RecordList",
            "statusLabel",
            statusLabel,
            "The status needs words a person can read.",
        );
    });
</script>

<!-- RecordList.svelte -->
<ul
    class={`record-list ${className}`}
    data-status={status}
    aria-label={label ?? statusLabel}
    {...restProps}
>
    {#if status !== "known"}<li class="record-list-status">{statusLabel}</li>{/if}
    {@render children?.()}
</ul>
