<script lang="ts">
    // RecordListItem component
    //
    // One record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Every word is the consumer's;
    // each status is text as well as a data-* attribute, and a status without words raises a development warning.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children: slot — the record itself, written by the consumer
    //   status: string (optional) — the record's status, as the consumer's code; rendered as data-status
    //   statusLabel: string (optional; required when status is set) — the status in words
    //   updated: string (optional) — when the record was last updated
    //   updatedLabel: string (optional) — that date as the consumer writes it; the <time> shows only when set
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // References:
    //   - IPS Composition section: https://hl7.org/fhir/uv/ips/StructureDefinition-Composition-uv-ips.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        status,
        statusLabel,
        updated,
        updatedLabel,
        children,
        ...restProps
    }: {
        status?: string;
        statusLabel?: string;
        updated?: string;
        updatedLabel?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (status)
            warnMissingProp(
                "RecordListItem",
                "statusLabel",
                statusLabel,
                "a status needs words a person can read, never a code alone.",
            );
    });
</script>

<!-- RecordListItem.svelte -->
<li
    class={`record-list-item ${className}`}
    data-status={status}
    {...restProps}
>
    {@render children?.()}
    {#if statusLabel}{" "}<span class="record-list-item-status">{statusLabel}</span>{/if}
    {#if updatedLabel}{" "}<time
            class="record-list-item-updated"
            datetime={updated}>{updatedLabel}</time
        >{/if}
</li>
