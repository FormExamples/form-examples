# MedicalBannerBoxForDanger

MedicalBannerBoxForDanger is a headless Svelte 5 component for displaying critical medical record danger information such as reactions, warnings, alarms, and other danger-level clinical alerts inside a `MedicalBanner`. It renders a `<div>` with `role="region"`, `aria-label`, and `data-type="danger"`.

## What it is

A labelled region for danger-level medical content. It provides a landmark (`role="region"`) with the `data-type="danger"` CSS hook so consumers can style it distinctly from advice-level content.

## What it does

- Renders a `<div>` with `class="medical-banner-box-for-danger"` plus any consumer-provided CSS class.
- Applies `role="region"` and `aria-label` from the required `label` prop.
- Applies `data-type="danger"` for CSS targeting.
- Renders the required `children` snippet as the region content.
- Spreads `...restProps` onto the `<div>`.

## When to use it

- Displaying critical clinical alerts: allergies, drug reactions, resuscitation status, infection-control flags.
- Warning clinicians about conditions that require immediate attention.
- Pairing with `MedicalBannerBoxForAdvice` to separate critical alerts from routine advice.

## When not to use it

- Do not use for routine advice or care-plan information — use `MedicalBannerBoxForAdvice`.
- Do not use for general warnings outside medical contexts — use `WarningCallout` or `Alert`.
- Do not use for modal urgency — use `AlertDialog`.

## How to use it

Place inside a `MedicalBanner` or `MedicalBannerBox`, pass a descriptive `label`, and render danger content via the `children` snippet.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible name via `aria-label`.
- `children` (Snippet, required) — the danger-region content.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>`.

## Usage

### Allergies alert

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "../MedicalBannerBox/MedicalBannerBox.svelte";
    import MedicalBannerBoxForDanger from "./MedicalBannerBoxForDanger.svelte";
</script>

<MedicalBanner label="Patient summary">
    <MedicalBannerBox>
        <MedicalBannerBoxForDanger label="Allergies">
            <p>Penicillin, peanuts</p>
        </MedicalBannerBoxForDanger>
    </MedicalBannerBox>
</MedicalBanner>
```

### Infection-control flag

```svelte
<script lang="ts">
    import MedicalBannerBoxForDanger from "./MedicalBannerBoxForDanger.svelte";
</script>

<MedicalBannerBoxForDanger label="Infection control">
    <p>MRSA positive — isolation precautions required</p>
</MedicalBannerBoxForDanger>
```

### Nested with advice in a full medical banner

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "../MedicalBannerBox/MedicalBannerBox.svelte";
    import MedicalBannerBoxForDanger from "./MedicalBannerBoxForDanger.svelte";
    import MedicalBannerBoxForAdvice from "../MedicalBannerBoxForAdvice/MedicalBannerBoxForAdvice.svelte";
</script>

<MedicalBanner label="Record summary" type="warning">
    <MedicalBannerBox>
        <MedicalBannerBoxForDanger label="Reactions">
            <p>Severe reaction to morphine</p>
        </MedicalBannerBoxForDanger>
        <MedicalBannerBoxForAdvice label="Contacts">
            <p>On-call: Dr. Patel</p>
        </MedicalBannerBoxForAdvice>
    </MedicalBannerBox>
</MedicalBanner>
```

### Danger with consumer CSS

```svelte
<script lang="ts">
    import MedicalBannerBoxForDanger from "./MedicalBannerBoxForDanger.svelte";
</script>

<MedicalBannerBoxForDanger class="danger-strong" label="DNACPR">
    <p>Do not attempt CPR</p>
</MedicalBannerBoxForDanger>

<style>
    :global(.danger-strong[data-type="danger"]) {
        background: #fee2e2;
        border-left: 4px solid #dc2626;
        padding: 0.5rem;
    }
</style>
```

### Dynamic danger list

```svelte
<script lang="ts">
    import MedicalBannerBoxForDanger from "./MedicalBannerBoxForDanger.svelte";
    let reactions = $state(["Penicillin", "Sulfa"]);
</script>

<MedicalBannerBoxForDanger label="Drug reactions">
    <ul>
        {#each reactions as reaction}
            <li>{reaction}</li>
        {/each}
    </ul>
</MedicalBannerBoxForDanger>
```

## Accessibility

- `role="region"` creates a discoverable landmark for screen readers.
- `aria-label` gives the region a clear accessible name.
- `data-type="danger"` is a CSS hook only; it does not affect ARIA semantics.
- No keyboard behaviour — the region is passive.
- Compliant with WCAG 2.2 AAA when the consumer supplies sufficient colour contrast (critical for danger styling).

## Related components

- `MedicalBanner` — the parent landmark region.
- `MedicalBannerBox` — flex-row layout container inside `MedicalBanner`.
- `MedicalBannerBoxForAdvice` — paired advice-level region.
- `Alert`, `AlertDialog`, `WarningCallout` — general-purpose warning/alert patterns.
- `CareCard` — a medical care instruction card with urgency levels.

---

Lily™ and Lily Design System™ are trademarks.
