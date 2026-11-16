<script lang="ts">
    // DecisionSupportCard component
    //
    // A headless clinical decision support card, in the shape of a CDS Hooks card (spec/healthcare-ui item 4): a one-line
    // summary, an urgency indicator, the source of the guidance, optional detail, suggestions, links, and a way to dismiss
    // it with a reason. CDS Hooks leaves rendering to the host system; this is that rendering, with no styling.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   summary — string, required. The one-sentence summary (CDS Hooks: under 140 characters). Names the card.
    //   indicator — "info" | "warning" | "critical", required. Rendered as data-indicator for the theme.
    //   indicatorLabel — string, required. The indicator in words ("Warning"), so urgency is never colour alone.
    //   sourceLabel — string, required. Where the guidance comes from.
    //   sourceHref — string, optional. A link to the source.
    //   children — Snippet, optional. The detail.
    //   suggestions — { id: string; label: string; isRecommended?: boolean }[], optional. Each is a button.
    //   onSuggestion — (id: string) => void, optional. Called when a suggestion is chosen. The consumer applies it, and
    //     enforces CDS Hooks' selectionBehavior ("at-most-one" or "any"), for example by removing the card.
    //   links — { label: string; href: string }[], optional. Links to more information.
    //   dismissLabel — string, optional. The dismiss button's text. No button is rendered without it.
    //   overrideReasons — { code: string; display: string }[], optional. When given, dismissing asks for one: the select
    //     is required, and onDismiss is not called until a reason is chosen.
    //   overrideReasonLabel — string, optional. The select's label ("Reason for dismissing").
    //   overrideReasonPlaceholder — string, optional. The text of the select's empty first option.
    //   onDismiss — (reason?: string) => void, optional. Called with the chosen reason's code.
    //   label — string, optional. The card's accessible name, when it should differ from summary.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Keyboard:
    //   - Tab moves through the source link, suggestions, links, the reason select and the dismiss button.
    //   - Enter or Space on a suggestion chooses it; Enter or Space on dismiss submits the reason.
    //
    // Accessibility:
    //   - role="group" named by the summary, not a landmark and not a live region: whether a critical card interrupts is
    //     the consumer's choice (put it in an AlertDialog), following AHRQ's alert-fatigue guidance.
    //   - A missing reason marks the select aria-invalid and moves focus to it.
    //
    // References:
    //   - CDS Hooks 2.0, Card: https://cds-hooks.hl7.org/2.0/
    //   - AHRQ PSNet primer, alert fatigue: https://psnet.ahrq.gov/primer/alert-fatigue
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        summary,
        indicator,
        indicatorLabel,
        sourceLabel,
        sourceHref,
        children,
        suggestions = [],
        onSuggestion,
        links = [],
        dismissLabel,
        overrideReasons = [],
        overrideReasonLabel,
        overrideReasonPlaceholder = "",
        onDismiss,
        label,
        ...restProps
    }: {
        summary: string;
        indicator: "info" | "warning" | "critical";
        indicatorLabel: string;
        sourceLabel: string;
        sourceHref?: string;
        children?: Snippet;
        suggestions?: { id: string; label: string; isRecommended?: boolean }[];
        onSuggestion?: (id: string) => void;
        links?: { label: string; href: string }[];
        dismissLabel?: string;
        overrideReasons?: { code: string; display: string }[];
        overrideReasonLabel?: string;
        overrideReasonPlaceholder?: string;
        onDismiss?: (reason?: string) => void;
        label?: string;
        [key: string]: unknown;
    } = $props();

    let reason = $state("");
    let invalid = $state(false);
    let select: HTMLSelectElement | undefined = $state();

    function dismiss(event: SubmitEvent) {
        event.preventDefault();
        if (overrideReasons.length > 0 && !reason) {
            invalid = true;
            select?.focus();
            return;
        }
        invalid = false;
        onDismiss?.(reason || undefined);
    }
</script>

<!-- DecisionSupportCard.svelte -->
<div
    class={`decision-support-card ${className}`}
    role="group"
    aria-label={label ?? summary}
    data-indicator={indicator}
    {...restProps}
>
    <p class="decision-support-card-header">
        <span class="decision-support-card-indicator">{indicatorLabel}</span>
        <span class="decision-support-card-summary">{summary}</span>
    </p>
    {#if children}<div class="decision-support-card-detail">{@render children()}</div>{/if}
    <p class="decision-support-card-source">
        {#if sourceHref}<a href={sourceHref}>{sourceLabel}</a>{:else}{sourceLabel}{/if}
    </p>
    {#if suggestions.length > 0}
        <div class="decision-support-card-suggestions">
            {#each suggestions as suggestion (suggestion.id)}
                <button
                    type="button"
                    class="decision-support-card-suggestion"
                    data-recommended={suggestion.isRecommended ? "true" : undefined}
                    onclick={() => onSuggestion?.(suggestion.id)}>{suggestion.label}</button
                >
            {/each}
        </div>
    {/if}
    {#if links.length > 0}
        <ul class="decision-support-card-links">
            {#each links as link (link.href)}<li><a href={link.href}>{link.label}</a></li>{/each}
        </ul>
    {/if}
    {#if dismissLabel}
        <form
            class="decision-support-card-override"
            novalidate
            onsubmit={dismiss}
        >
            {#if overrideReasons.length > 0}
                <label class="decision-support-card-override-label"
                    >{overrideReasonLabel}
                    <select
                        class="decision-support-card-override-reason"
                        required
                        aria-invalid={invalid ? "true" : undefined}
                        bind:this={select}
                        bind:value={reason}
                        onchange={() => (invalid = false)}
                    >
                        <option value="">{overrideReasonPlaceholder}</option>
                        {#each overrideReasons as option (option.code)}<option value={option.code}
                                >{option.display}</option
                            >{/each}
                    </select></label
                >
            {/if}
            <button
                type="submit"
                class="decision-support-card-dismiss">{dismissLabel}</button
            >
        </form>
    {/if}
</div>
