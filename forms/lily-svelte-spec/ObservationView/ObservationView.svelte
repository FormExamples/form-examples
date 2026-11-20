<script lang="ts">
    // ObservationView component
    //
    // A headless read-only display of one clinical observation or test result: its value, unit, interpretation flag and
    // reference range (spec/healthcare-ui item 1). It shows what the consumer's code decided; it computes no flag and no range.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the observation ("Potassium"), when no visible caption does.
    //   value — string, optional. The value, already formatted by the consumer (for example with formatQuantity's number).
    //   unit — string, optional. The unit ("mmol/L"). Joined to the value by a no-break space, so they never wrap apart.
    //   interpretation — string, optional. A FHIR v3 ObservationInterpretation code: "N", "L", "H", "LL", "HH", "A" and
    //     others. Rendered as data-interpretation for CSS; never shown as text by itself.
    //   flagLabel — string, optional. The consumer's words for the flag ("High"). Required whenever the flag is not normal,
    //     so the meaning is never colour alone (WCAG 1.4.1); a development warning says so.
    //   range — string, optional. The reference range as text ("3.5–5.3").
    //   ranges — { label, text }[], optional. Further named ranges ("Critical", "below 2.5"), each its own -range part with a
    //     -range-label, after range (openEHR other_reference_ranges).
    //   previousValue — string, optional. A superseded value, shown in a <del> so a reader who saw it knows it changed.
    //   previousLabel — string, optional. The consumer's words for it ("was 5.1 until 3 Nov"); required with previousValue.
    //   It never infers an interpretation: with no interpretation there is no flag and no data-interpretation, even when
    //     a range is given, so a result whose range is missing or still loading is never shown as normal.
    //   status — "final" | "preliminary" | "amended" | "corrected" | "entered-in-error" | "cancelled" | "masked" | "not-recorded" | "unavailable" | "not-applicable", default "final". Rendered as data-status.
    //   statusLabel — string, optional. The consumer's words for a status that is not final ("Not recorded"). For
    //     cancelled, masked, not-recorded, unavailable and not-applicable it replaces the value, so a missing result is never a blank or a
    //     dash; for any other status but final it is shown beside the value.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <ObservationView label="Potassium" value="5.9" unit="mmol/L" interpretation="H" flagLabel="High" range="3.5–5.3" />
    //   <ObservationView label="Potassium" status="not-recorded" statusLabel="Not recorded" />
    //
    // Accessibility:
    //   - A plain span cannot take aria-label, so label renders as hidden text in a screen-reader-span.
    //   - The flag is text, so a screen reader hears "High"; colour is the theme's addition.
    //
    // Internationalization:
    //   - Every word is a prop; the value and range arrive formatted for the consumer's locale.
    //
    // References:
    //   - FHIR Observation.interpretation: https://hl7.org/fhir/observation.html
    import { warnMissingProp } from "../dev-warning";

    // FHIR statuses with no value to show: the consumer's words replace it. Every other status that is not final shows the
    // value with its words beside it, so an amended, corrected or entered-in-error result never reads as a plain one.
    const MISSING: readonly string[] = [
        "cancelled",
        "masked",
        "not-recorded",
        "unavailable",
        "not-applicable",
    ];

    let {
        class: className = "",
        label,
        value = "",
        unit,
        interpretation,
        flagLabel,
        range,
        ranges = [],
        previousValue,
        previousLabel,
        status = "final",
        statusLabel,
        ...restProps
    }: {
        label?: string;
        value?: string;
        unit?: string;
        interpretation?: string;
        flagLabel?: string;
        range?: string;
        ranges?: { label: string; text: string }[];
        previousValue?: string;
        previousLabel?: string;
        status?:
            | "final"
            | "preliminary"
            | "amended"
            | "corrected"
            | "entered-in-error"
            | "cancelled"
            | "masked"
            | "not-recorded"
            | "unavailable"
            | "not-applicable";
        statusLabel?: string;
        [key: string]: unknown;
    } = $props();

    const missing = $derived(MISSING.includes(status));

    $effect(() => {
        if (status !== "final")
            warnMissingProp(
                "ObservationView",
                "statusLabel",
                statusLabel,
                "A result that is not final must say so in words.",
            );
        if (previousValue)
            warnMissingProp(
                "ObservationView",
                "previousLabel",
                previousLabel,
                "a superseded value needs words saying it changed, since a screen reader may not announce <del>.",
            );
        if (interpretation && interpretation !== "N")
            warnMissingProp(
                "ObservationView",
                "flagLabel",
                flagLabel,
                "An abnormal flag needs words, not colour alone (WCAG 1.4.1).",
            );
    });
</script>

<!-- ObservationView.svelte -->
<span
    class={`observation-view ${className}`}
    data-interpretation={interpretation || undefined}
    data-status={status}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{#if missing}<span
            class="observation-view-status">{statusLabel}</span
        >{:else}<span class="observation-view-value">{value}</span>{#if unit}{" "}<span
                class="observation-view-unit">{unit}</span
            >{/if}{#if flagLabel}{" "}<span class="observation-view-flag">{flagLabel}</span
            >{/if}{#if range}{" "}<span class="observation-view-range">{range}</span
            >{/if}{#each ranges as named (named.label)}{" "}<span class="observation-view-range"
                ><span class="observation-view-range-label">{named.label}</span
                >{" "}{named.text}</span
            >{/each}{#if previousValue}{" "}<del class="observation-view-previous-value"
                >{previousValue}</del
            >{#if previousLabel}{" "}<span class="observation-view-previous-label"
                    >{previousLabel}</span
                >{/if}{/if}{#if status !== "final" && statusLabel}{" "}<span
                class="observation-view-status">{statusLabel}</span
            >{/if}{/if}</span
>
