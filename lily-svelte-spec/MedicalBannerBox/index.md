# MedicalBannerBox

MedicalBannerBox is a headless Svelte 5 layout component designed to be placed inside a `MedicalBanner`. It renders a `<div>` with `data-context="medical"` that the consumer typically styles with flexbox horizontal layout to arrange medical banner content items side by side.

## What it is

A passive layout wrapper for medical banner content. It carries an optional `aria-label` and the `data-context="medical"` hook for consumer CSS; it has no state, no keyboard behaviour, and no built-in styling.

## What it does

- Renders a `<div>` with `class="medical-banner-box"` plus any consumer-provided CSS class.
- Applies `data-context="medical"` for CSS targeting.
- Applies `aria-label` when the optional `label` prop is provided.
- Renders the required `children` snippet as the box content.
- Spreads `...restProps` onto the `<div>`.

## When to use it

- Grouping multiple pieces of medical-banner content horizontally inside a `MedicalBanner`.
- Hosting nested `MedicalBannerBoxForAdvice` and `MedicalBannerBoxForDanger` sections in a single row.
- Providing a scoped CSS target for medical-context layout.

## When not to use it

- Do not use outside a `MedicalBanner` — use `BannerBox` for non-medical banners.
- Do not use for a single standalone region — nest `MedicalBannerBoxForAdvice` or `MedicalBannerBoxForDanger` directly inside the `MedicalBanner`.
- Do not use for general layout — use a plain `<div>` or one of the layout components (`GrailLayout`, `ContentBlock`).

## How to use it

Place `MedicalBannerBox` inside a `MedicalBanner` and nest domain-specific `MedicalBannerBoxForAdvice` / `MedicalBannerBoxForDanger` children, or arbitrary content.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `medical-banner-box` class.
- `label` (string, optional) — accessible name via `aria-label`.
- `children` (Snippet, required) — the box content.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>`.

## Usage

### Box nesting advice and danger sections

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "./MedicalBannerBox.svelte";
    import MedicalBannerBoxForDanger from "../MedicalBannerBoxForDanger/MedicalBannerBoxForDanger.svelte";
    import MedicalBannerBoxForAdvice from "../MedicalBannerBoxForAdvice/MedicalBannerBoxForAdvice.svelte";
</script>

<MedicalBanner label="Patient summary">
    <MedicalBannerBox>
        <MedicalBannerBoxForDanger label="Allergies">
            <p>Penicillin</p>
        </MedicalBannerBoxForDanger>
        <MedicalBannerBoxForAdvice label="Care team">
            <p>GP: Dr. Rivera</p>
        </MedicalBannerBoxForAdvice>
    </MedicalBannerBox>
</MedicalBanner>
```

### Box with an accessible label

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "./MedicalBannerBox.svelte";
</script>

<MedicalBanner label="Record">
    <MedicalBannerBox label="Patient identifiers">
        <p>MRN: 00123</p>
        <p>DOB: 1980-01-01</p>
    </MedicalBannerBox>
</MedicalBanner>
```

### Box with consumer CSS for horizontal flex

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "./MedicalBannerBox.svelte";
</script>

<MedicalBanner label="Summary">
    <MedicalBannerBox class="flex-row">
        <div>Section 1</div>
        <div>Section 2</div>
        <div>Section 3</div>
    </MedicalBannerBox>
</MedicalBanner>

<style>
    :global(.flex-row) {
        display: flex;
        gap: 1rem;
    }
</style>
```

### Box with a data attribute variant

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "./MedicalBannerBox.svelte";
</script>

<MedicalBanner label="Ward overview">
    <MedicalBannerBox data-layout="compact">
        <p>Bed 12A — stable</p>
    </MedicalBannerBox>
</MedicalBanner>
```

### Multiple boxes stacked

```svelte
<script lang="ts">
    import MedicalBanner from "../MedicalBanner/MedicalBanner.svelte";
    import MedicalBannerBox from "./MedicalBannerBox.svelte";
</script>

<MedicalBanner label="Shift report">
    <MedicalBannerBox label="Morning">
        <p>12 admissions</p>
    </MedicalBannerBox>
    <MedicalBannerBox label="Afternoon">
        <p>8 discharges</p>
    </MedicalBannerBox>
</MedicalBanner>
```

## Accessibility

- The parent `MedicalBanner` provides the landmark and `aria-live` announcement.
- `aria-label` (optional) provides an accessible name for this specific layout box.
- `data-context="medical"` is a CSS hook; it does not affect ARIA semantics.
- No keyboard behaviour — the box is passive.

## Related components

- `MedicalBanner` — the landmark region this box lives inside.
- `MedicalBannerBoxForAdvice` — advice-level nested region.
- `MedicalBannerBoxForDanger` — danger-level nested region.
- `BannerBox` — non-medical equivalent for `Banner`.
- `Banner` — the non-medical banner root.
