# NetPromoterScorePicker

NetPromoterScorePicker is a headless Svelte 5 Net Promoter Score (NPS) rating input. It renders a `<fieldset>` with `role="radiogroup"` containing 11 radio buttons (values `"0"` through `"10"`). NPS is a widely-used customer-loyalty metric where scores are categorised as Detractors (0–6), Passives (7–8), and Promoters (9–10).

## What it is

An accessible, ready-to-use NPS radio group. The fieldset handles the ARIA `radiogroup`; each of the 11 radio inputs is rendered inside a native `<label>` that also displays the numeric score.

## What it does

- Renders a `<fieldset>` with `class="net-promoter-score-picker"` plus any consumer-provided CSS class.
- Applies `role="radiogroup"` and `aria-label` from the required `label` prop.
- Loops from 0 to 10 and renders each as a `<label>` containing an `<input type="radio">` plus the numeric text.
- Each radio receives `name` (default `"nps"`), `value={String(score)}`, and `aria-label={String(score)}`.
- Sets `checked` based on equality with `value` and updates `value` on change.
- Provides bindable `value` via `$bindable("")` (string form of the chosen score).
- Spreads `...restProps` onto the `<fieldset>`.

## When to use it

- Post-interaction surveys asking "How likely are you to recommend us?".
- Any customer-loyalty measurement using the 0–10 NPS scale.
- Combining with free-text follow-up ("Why did you choose that score?").

## When not to use it

- Do not use for star-rating satisfaction — use `FiveStarRatingPicker`.
- Do not use for face/emoji satisfaction rating — use `FiveFaceRatingPicker`.
- Do not use for red/amber/green status — use `RedAmberGreenPicker`.
- Do not use for arbitrary-scale numeric input — use `RangeInput` or `NumberInput`.
- Do not use for display — use `NetPromoterScoreView`.

## How to use it

Import the component, pass a descriptive `label`, and bind the `value`. The value is a string `"0"`–`"10"` (empty `""` when none selected).

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible label for the radiogroup.
- `value` (string, optional, default `""`) — currently selected NPS score (`"0"`–`"10"`); bindable via `bind:value`.
- `name` (string, optional, default `"nps"`) — the radio group's `name` attribute.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<fieldset>`.

## Usage

### Basic NPS rating input (fieldset radiogroup with 0–10 radios)

```svelte
<script lang="ts">
    import NetPromoterScorePicker from "./NetPromoterScorePicker.svelte";
    let score = $state("");
</script>

<NetPromoterScorePicker
    label="How likely are you to recommend us?"
    bind:value={score}
/>
<p>Selected: {score || "none"}</p>
```

The rendered markup is a `<fieldset role="radiogroup">` containing 11 `<label>` wrappers, each with an `<input type="radio" name="nps" value="0…10">`.

### Custom radio group name

```svelte
<script lang="ts">
    import NetPromoterScorePicker from "./NetPromoterScorePicker.svelte";
    let score = $state("");
</script>

<NetPromoterScorePicker
    label="Rate our service"
    bind:value={score}
    name="service-nps"
/>
```

### Preselected value

```svelte
<script lang="ts">
    import NetPromoterScorePicker from "./NetPromoterScorePicker.svelte";
    let score = $state("9");
</script>

<NetPromoterScorePicker label="Likelihood to recommend" bind:value={score} />
```

### Classifying Detractors / Passives / Promoters

```svelte
<script lang="ts">
    import NetPromoterScorePicker from "./NetPromoterScorePicker.svelte";
    let score = $state("");
    const category = $derived(() => {
        const n = Number(score);
        if (!score) return "";
        if (n <= 6) return "Detractor";
        if (n <= 8) return "Passive";
        return "Promoter";
    });
</script>

<NetPromoterScorePicker
    label="How likely are you to recommend us?"
    bind:value={score}
/>
{#if score}
    <p>Category: {category()}</p>
{/if}
```

### Inside a survey form

```svelte
<script lang="ts">
    import NetPromoterScorePicker from "./NetPromoterScorePicker.svelte";
    import TextAreaInput from "../TextAreaInput/TextAreaInput.svelte";
    let score = $state("");
    let feedback = $state("");

    function submit(e: SubmitEvent) {
        e.preventDefault();
        console.log({ score, feedback });
    }
</script>

<form onsubmit={submit}>
    <NetPromoterScorePicker
        label="How likely are you to recommend us?"
        bind:value={score}
    />
    <TextAreaInput label="Why?" bind:value={feedback} />
    <button type="submit">Submit</button>
</form>
```

## Accessibility

- `<fieldset>` with `role="radiogroup"` establishes the group.
- `aria-label` provides the group's accessible name.
- Each radio has its own `aria-label` set to its numeric value so screen readers announce "0", "1", "2"… correctly.
- Native radio keyboard behaviour: Arrow keys move/select within the group; Tab moves focus into and out of the group; Space selects the focused radio.
- Compliant with WAI-ARIA `radiogroup` pattern and WCAG 2.2 AAA with consumer-provided focus indicators.

## Related components

- `NetPromoterScoreView` — paired read-only display of an NPS score.
- `NetPromoterScorePickerButton` — a single picker button variant.
- `FiveStarRatingPicker` / `FiveStarRatingView` — 1–5 star rating.
- `FiveFaceRatingPicker` / `FiveFaceRatingView` — 1–5 face satisfaction rating.
- `RedAmberGreenPicker` / `RedAmberGreenView` — red/amber/green status.
- `RedOrangeYellowGreenBluePicker` / `RedOrangeYellowGreenBlueView` — five-level colour status.
- `RadioGroup` — generic radio group.
- `RangeInput` — slider input for numeric values.

---

Lily™ and Lily Design System™ are trademarks.
