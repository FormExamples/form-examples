<script lang="ts">
    // EarlyWarningScoreView component
    //
    // A headless read-only display of an early warning score (spec/healthcare-ui item 5): the scoring system's name, the
    // score, its band and the escalation it calls for. Display only: it computes nothing. Scoring systems differ by country
    // and population (NEWS2, PEWS, MEWS, qSOFA and local variants), and scoring is the consumer's validated code.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value, when no visible caption does.
    //   score — string | number, required. The score the consumer computed.
    //   system — string, optional. The scoring system's name ("NEWS2").
    //   band — string, optional. The consumer's band key ("low", "medium", "high"), as data-band for the theme.
    //   bandLabel — string, optional. The band in words ("High"). Required with band, so a band is never colour alone.
    //   escalation — string, optional. What to do ("Urgent response").
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <EarlyWarningScoreView system="NEWS2" score={7} band="high" bandLabel="High" escalation="Urgent response" />
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        label,
        score,
        system,
        band,
        bandLabel,
        escalation,
        ...restProps
    }: {
        label?: string;
        score: string | number;
        system?: string;
        band?: string;
        bandLabel?: string;
        escalation?: string;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        if (band)
            warnMissingProp(
                "EarlyWarningScoreView",
                "bandLabel",
                bandLabel,
                "A band needs words, not colour alone (WCAG 1.4.1).",
            );
    });
</script>

<!-- EarlyWarningScoreView.svelte -->
<span
    class={`early-warning-score-view ${className}`}
    data-band={band}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{#if system}<span
            class="early-warning-score-view-system">{system}</span
        >{" "}{/if}<span class="early-warning-score-view-score">{score}</span
    >{#if bandLabel}{" "}<span class="early-warning-score-view-band">{bandLabel}</span
        >{/if}{#if escalation}{" "}<span class="early-warning-score-view-escalation"
            >{escalation}</span
        >{/if}</span
>
