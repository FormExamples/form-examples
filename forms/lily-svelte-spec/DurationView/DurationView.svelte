<script lang="ts">
    // DurationView component
    //
    // A length of time in the consumer's words, in a <time> element whose datetime is the ISO 8601 duration (tasks.md
    // P29-T6, spec/lessons/openehr item 5). A datetime duration holds only days, hours, minutes and seconds, since a
    // year or a month has no fixed length, and holds no sign: a negative duration ("3 days early") renders the length
    // as datetime and data-negative, and its direction is in the consumer's words. Lily writes no words for units; take
    // them from Intl.DurationFormat with durationParts() (exported with this library), or write them yourself.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, required. The length of time as the consumer writes it ("3 days 4 hours").
    //   duration — string, required. The same length as an ISO 8601 duration ("P3DT4H", "-PT90M"), as datetime.
    //   label — string, optional. Hidden text naming the value ("Length of stay"), when no visible caption does.
    //   ...restProps — additional HTML attributes spread onto the <time>.
    //
    // Syntax:
    //   <DurationView value="3 days 4 hours" duration="P3DT4H" />
    //
    // References:
    //   - HTML valid duration string: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#durations
    //   - openEHR DV_DURATION: https://specifications.openehr.org/releases/RM/latest/data_types.html
    import { htmlDuration } from "../clinical-format";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        value = "",
        duration = "",
        label,
        ...restProps
    }: {
        /** The length of time as the consumer writes it. */
        value: string;
        /** The same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative. */
        duration: string;
        /** Hidden text naming the value. */
        label?: string;
        [key: string]: unknown;
    } = $props();

    const parsed = $derived(htmlDuration(duration));

    $effect(() => {
        warnMissingProp(
            "DurationView",
            "value",
            value,
            "a length of time needs words a person can read, never an ISO code alone.",
        );
        warnMissingProp(
            "DurationView",
            "duration",
            parsed?.datetime,
            "datetime takes an ISO 8601 duration of days, hours, minutes and seconds; use age-view or plain text for years and months.",
        );
    });
</script>

<!-- DurationView.svelte -->
<time
    class={`duration-view ${className}`}
    datetime={parsed?.datetime}
    data-negative={parsed?.negative ? "" : undefined}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</time
>
