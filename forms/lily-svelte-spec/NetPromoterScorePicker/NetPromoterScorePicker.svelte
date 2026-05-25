<script lang="ts">
    // NetPromoterScorePicker component
    //
    // A headless Net Promoter Score (NPS) rating input that renders a fieldset
    // with role="radiogroup" containing 11 radio buttons (0-10). NPS is a widely
    // used customer loyalty metric where scores are categorized as Detractors (0-6),
    // Passives (7-8), and Promoters (9-10). The value prop is bindable for reactive
    // form integration.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for the radiogroup via aria-label.
    //   value — string, default "". Currently selected NPS score ("0"-"10"); bindable via $bindable().
    //   name — string, default "nps". Name attribute for the radio input group.
    //   ...restProps — additional HTML attributes spread onto the <fieldset>.
    //
    // Syntax:
    //   <NetPromoterScorePicker label="How likely are you to recommend us?" bind:value={score} />
    //
    // Examples:
    //   <!-- Basic NPS rating input -->
    //   <NetPromoterScorePicker
    //     label="How likely are you to recommend us?"
    //     bind:value={score}
    //   />
    //
    //   <!-- With a custom radio group name -->
    //   <NetPromoterScorePicker
    //     label="Rate our service"
    //     bind:value={score}
    //     name="service-nps"
    //   />
    //
    // Keyboard:
    //   - Arrow keys: navigate between radio buttons (native radio group behavior)
    //   - Space: select the focused radio button
    //   - Tab: move focus into/out of the radio group
    //
    // Accessibility:
    //   - role="radiogroup" on the fieldset
    //   - aria-label on the fieldset from the label prop
    //   - Each radio button has aria-label with its numeric value
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Radio values are strings ("0" through "10")
    //   - Part of the Input/View pattern; pairs with NetPromoterScoreView
    //
    // References:
    //   - Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
    //   - WAI-ARIA Radiogroup Role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup

    let {
        class: className = "",
        label,
        value = $bindable(""),
        name = "nps",
        ...restProps
    }: {
        /** Accessible label describing the rating input purpose */
        label: string;
        /** Currently selected NPS score value (0-10), bindable */
        value?: string;
        /** Name attribute for the radio input group */
        name?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- NetPromoterScorePicker: a fieldset radiogroup with 11 radio buttons (0-10) -->
<fieldset
    class={`net-promoter-score-picker ${className}`}
    role="radiogroup"
    aria-label={label}
    {...restProps}
>
    {#each Array.from({ length: 11 }, (_, i) => i) as score}
        <label>
            <input
                type="radio"
                {name}
                value={String(score)}
                checked={value === String(score)}
                aria-label={String(score)}
                onchange={() => {
                    value = String(score);
                }}
            />
            {score}
        </label>
    {/each}
</fieldset>
