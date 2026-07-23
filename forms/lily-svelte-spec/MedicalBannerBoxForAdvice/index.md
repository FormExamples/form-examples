# MedicalBannerBoxForAdvice

MedicalBannerBoxForAdvice is a headless Svelte 5 component for displaying routine medical record advice such as contacts, contexts, care plans, and other advice-level clinical data inside a `MedicalBanner`. It renders a `<div>` with `role="region"`, `aria-label`, and `data-type="advice"`.

## What it is

A labelled region for advice-level medical content. It provides a landmark (`role="region"`) with the `data-type="advice"` CSS hook so consumers can style it distinctly from danger-level content.

## What it does

- Renders a `<div>` with `class="medical-banner-box-for-advice"` plus any consumer-provided CSS class.
- Applies `role="region"` and `aria-label` from the required `label` prop.
- Applies `data-type="advice"` for CSS targeting.
- Renders the required `children` snippet as the region content.
- Spreads `...restProps` onto the `<div>`.

## When to use it

- Displaying care contacts, care plans, review dates, and other advisory information inside a `MedicalBanner` or `MedicalBannerBox`.
- Presenting routine clinical advice that is important but not alarming.
- Pairing with `MedicalBannerBoxForDanger` to separate advice from critical alerts.

## When not to use it

- Do not use for critical danger-level content — use `MedicalBannerBoxForDanger`.
- Do not use outside a medical context — use `InformationCallout` or `Alert` for general advice.
- Do not use for non-regional content — the component emits a `role="region"` landmark that should describe a meaningful section.

## How to use it

Place inside a `MedicalBanner` or `MedicalBannerBox`, pass a descriptive `label`, and render advice content via the `children` snippet.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible name via `aria-label`.
- `children` (Snippet, required) — the advice-region content.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>`.

## Usage

### Care contacts advice

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "../MedicalBannerBox/MedicalBannerBox.svelte";
    import MedicalBannerBoxForAdvice from "./MedicalBannerBoxForAdvice.svelte";
</script>

<MedicalBanner label="Summary">
    <MedicalBannerBox>
        <MedicalBannerBoxForAdvice label="Care contacts">
            <p>GP: Dr. Rivera</p>
            <p>Consultant: Dr. Okafor</p>
        </MedicalBannerBoxForAdvice>
    </MedicalBannerBox>
</MedicalBanner>
```

### Review date advice

```svelte
<script lang="ts">
    import MedicalBannerBoxForAdvice from "./MedicalBannerBoxForAdvice.svelte";
</script>

<MedicalBannerBoxForAdvice label="Care plan review">
    <p>Next review due 2026-06-01.</p>
</MedicalBannerBoxForAdvice>
```

### Advice alongside danger (nested composition)

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "../MedicalBannerBox/MedicalBannerBox.svelte";
    import MedicalBannerBoxForAdvice from "./MedicalBannerBoxForAdvice.svelte";
    import MedicalBannerBoxForDanger from "../MedicalBannerBoxForDanger/MedicalBannerBoxForDanger.svelte";
</script>

<MedicalBanner label="Record summary">
    <MedicalBannerBox>
        <MedicalBannerBoxForDanger label="Allergies">
            <p>Peanuts</p>
        </MedicalBannerBoxForDanger>
        <MedicalBannerBoxForAdvice label="Diet">
            <p>Low sodium</p>
        </MedicalBannerBoxForAdvice>
    </MedicalBannerBox>
</MedicalBanner>
```

### Advice with consumer CSS

```svelte
<script lang="ts">
    import MedicalBannerBoxForAdvice from "./MedicalBannerBoxForAdvice.svelte";
</script>

<MedicalBannerBoxForAdvice class="advice-soft" label="Notes">
    <p>Patient prefers morning appointments.</p>
</MedicalBannerBoxForAdvice>

<style>
    :global(.advice-soft[data-type="advice"]) {
        background: #eff6ff;
        padding: 0.5rem;
    }
</style>
```

### Advice bound from state

```svelte
<script lang="ts">
    import MedicalBannerBoxForAdvice from "./MedicalBannerBoxForAdvice.svelte";
    let contacts = $state(["Dr. Rivera", "Nurse Lee"]);
</script>

<MedicalBannerBoxForAdvice label="Care team">
    <ul>
        {#each contacts as contact}
            <li>{contact}</li>
        {/each}
    </ul>
</MedicalBannerBoxForAdvice>
```

## Accessibility

- `role="region"` creates a discoverable landmark for screen readers.
- `aria-label` gives the region a clear accessible name.
- `data-type="advice"` is a CSS hook only; it does not affect ARIA semantics.
- No keyboard behaviour — the region is passive.
- Compliant with WCAG 2.2 AAA when the consumer supplies colour contrast.

## Related components

- `MedicalBanner` — the parent landmark region.
- `MedicalBannerBox` — flex-row layout container within `MedicalBanner`.
- `MedicalBannerBoxForDanger` — paired danger-level region.
- `InformationCallout` — general supplementary info outside medical contexts.
- `WarningCallout` — dedicated warning callout.

---

Lily™ and Lily Design System™ are trademarks.
