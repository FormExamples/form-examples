<script lang="ts">
    // DeviceRecordListItem component
    //
    // One medical device in a device record list, with its status and when it was used (tasks.md P28-T3, spec/healthcare-ui). Every word is the consumer's;
    // each status is text as well as a data-* attribute, and a status without words raises a development warning.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   device: string (required) — the device; never truncated
    //   status: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" (optional) — FHIR DeviceUseStatement status; rendered as data-status
    //   statusLabel: string (optional; required when status is set) — the status in words
    //   timing: string (optional) — when it was used, for <time datetime>
    //   timingLabel: string (optional) — that date as the consumer writes it; the <time> shows only when set
    //   children: slot (optional) — anything else, such as a link to the full record
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // References:
    //   - FHIR DeviceUseStatement: https://hl7.org/fhir/R4/deviceusestatement.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        device,
        status,
        statusLabel,
        timing,
        timingLabel,
        children,
        ...restProps
    }: {
        device: string;
        status?: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold";
        statusLabel?: string;
        timing?: string;
        timingLabel?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (status)
            warnMissingProp(
                "DeviceRecordListItem",
                "statusLabel",
                statusLabel,
                "a status needs words a person can read, never a code alone.",
            );
    });
</script>

<!-- DeviceRecordListItem.svelte -->
<li
    class={`device-record-list-item ${className}`}
    data-status={status}
    {...restProps}
>
    <span class="device-record-list-item-device">{device}</span>
    {#if statusLabel}{" "}<span class="device-record-list-item-status">{statusLabel}</span>{/if}
    {#if timingLabel}{" "}<time
            class="device-record-list-item-timing"
            datetime={timing}>{timingLabel}</time
        >{/if}
    {@render children?.()}
</li>
