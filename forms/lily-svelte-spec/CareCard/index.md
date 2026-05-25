# CareCard

A headless healthcare guidance component inspired by NHS England care card patterns. It renders a `<section>` landmark with a required `<h2>` heading and body content, and exposes a `data-type` attribute for three urgency tiers: `non-urgent`, `urgent`, and `immediate`.

## What it is

CareCard is a Svelte 5 component that emits `<section role="region">` with `aria-label` (defaulting to the heading), an `<h2>` heading element, and consumer-provided body content. The `data-type` attribute advertises the urgency tier so consumer CSS can apply urgency-appropriate visual treatment (for example, NHS blue for `non-urgent`, red for `immediate`).

## What it does

- Renders a landmark `<section>` with `role="region"` and `aria-label`.
- Always renders an `<h2>` heading from the required `heading` prop.
- Renders the body content via `children`.
- Exposes `data-type` reflecting the urgency tier.

## When to use it

- Presenting safety-critical medical guidance in healthcare apps, patient portals, and clinical tools.
- Advising patients when to speak to a GP, call a triage line (e.g. 111), visit A&E, or call emergency services (e.g. 999).
- Separating conditional advice visually by urgency while keeping semantics consistent.

## When not to use it

- For general informational callouts — use `InformationCallout` or `Alert`.
- For a warning that is not medical — use `WarningCallout`.
- When the card does not represent an urgency tier in healthcare guidance.

## How to use it

Provide a required `heading` describing the action, and optionally pick one of the three `type` values. Consumers supply styling via CSS targeting `[data-type="..."]`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `type` | `"non-urgent" \| "urgent" \| "immediate"` | `"non-urgent"` | Urgency tier exposed via `data-type`. |
| `heading` | `string` | required | Heading text rendered in an `<h2>`. |
| `label` | `string` | `undefined` | `aria-label` override; defaults to `heading`. |
| `children` | `Snippet` | required | Body content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<section>`. |

## Usage

```svelte
<script lang="ts">
    import CareCard from "./CareCard.svelte";
</script>

<CareCard type="non-urgent" heading="Speak to a GP if:">
    <ul>
        <li>symptoms have lasted more than 3 days</li>
    </ul>
</CareCard>
```

```svelte
<script lang="ts">
    import CareCard from "./CareCard.svelte";
</script>

<CareCard type="urgent" heading="Ask for an urgent GP appointment or call 111 if:">
    <ul>
        <li>you feel faint or very weak</li>
        <li>you have a high temperature</li>
    </ul>
</CareCard>
```

```svelte
<script lang="ts">
    import CareCard from "./CareCard.svelte";
</script>

<CareCard type="immediate" heading="Call 999 or go to A&E if:">
    <ul>
        <li>you have sudden chest pain</li>
        <li>you have difficulty breathing</li>
    </ul>
</CareCard>
```

```svelte
<script lang="ts">
    import CareCard from "./CareCard.svelte";
</script>

<CareCard heading="Self-care" label="Self-care advice">
    <p>Rest, drink fluids, and monitor your symptoms.</p>
</CareCard>
```

## Accessibility

- `role="region"` names this container as a landmark.
- `aria-label` defaults to the heading text so screen readers announce the purpose.
- `<h2>` provides structure and is recommended for the NHS care card pattern.
- `data-type` is a styling hook only — it does not change semantics.

## Related components

- `Alert`, `AlertDialog` — for time-bound and modal alert messages.
- `InformationCallout`, `WarningCallout` — general, non-clinical callouts.
- `MedicalBanner`, `MedicalBannerBox` — page-level medical messaging.
