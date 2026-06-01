# TourListItem

A single step within a `TourList` guided tour, rendered as a `<li role="group">` with `aria-roledescription="step"`, `aria-current`, and conditional `hidden`/`aria-hidden` based on whether the step is current.

## What it is

`TourListItem` is a headless Svelte 5 component representing one step of a guided walkthrough. It renders a `<li>` with group-step ARIA semantics, hides itself unless it is the currently active step, and composes a progress-aware accessible label when `stepNumber` and `totalSteps` are supplied.

## What it does

- Renders `<li class="tour-list-item {className}" role="group" aria-roledescription="step">`.
- Derives a `fullLabel` — `"{label} (Step N of M)"` when both `stepNumber` and `totalSteps` are provided, otherwise just `label` — and assigns it to `aria-label`.
- Sets `aria-current="step"` when `current` is true.
- Sets `aria-hidden="true"` and the HTML `hidden` attribute when `current` is false, so inactive steps are hidden for both sighted and assistive users.
- Renders the `children` snippet as the step content.
- Spreads additional HTML attributes onto the `<li>`.

## When to use it

- Inside a `TourList` for each step of a guided walkthrough.
- Multi-step onboarding sequences.
- Feature-release tutorials with ordered steps.

## When not to use it

- Don't use it outside a list — a bare `<li>` is invalid elsewhere.
- Don't use it for general-purpose list items — use `TimelineListItem` or `TaskListItem`.
- Don't use it for menu items — use `MenuItem`.
- Don't use it for navigation — use `TreeListItem` or similar.

## How to use it

Import and place inside `TourList` (possibly nested under a `Tour`). Pass a translated `label` and set `current` based on your external step index. Supply `stepNumber` and `totalSteps` for the "Step N of M" suffix in the accessible label.

## Props

- `class` — string, optional. Extra CSS class appended to `tour-list-item`.
- `label` — string, required. Accessible label for this step.
- `current` — boolean, default `false`. Whether this step is the currently visible step.
- `stepNumber` — number, optional. 1-based step number.
- `totalSteps` — number, optional. Total steps in the tour.
- `children` — Snippet, required. Step content.
- `...restProps` — any additional HTML attributes spread onto the `<li>`.

## Usage

```svelte
<script lang="ts">
  import TourList from "../TourList/TourList.svelte";
  import TourListItem from "./TourListItem.svelte";

  let active = $state(true);
  let step = $state(0);
</script>

<TourList label="Steps" bind:active>
  <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={2}>
    <p>Welcome!</p>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Done" current={step === 1} stepNumber={2} totalSteps={2}>
    <button onclick={() => (active = false)}>Finish</button>
  </TourListItem>
</TourList>
```

```svelte
<script lang="ts">
  import Tour from "../Tour/Tour.svelte";
  import TourList from "../TourList/TourList.svelte";
  import TourListItem from "./TourListItem.svelte";

  const steps = [
    { label: "Dashboard", body: "Your overview." },
    { label: "Settings", body: "Configure your account." },
    { label: "Done", body: "All set." },
  ];

  let active = $state(true);
  let step = $state(0);
</script>

<Tour label="Tour" bind:active>
  <TourList label="Steps" active>
    {#each steps as s, i}
      <TourListItem
        label={s.label}
        current={step === i}
        stepNumber={i + 1}
        totalSteps={steps.length}
      >
        <p>{s.body}</p>
        {#if i < steps.length - 1}
          <button onclick={() => step++}>Next</button>
        {:else}
          <button onclick={() => (active = false)}>Finish</button>
        {/if}
      </TourListItem>
    {/each}
  </TourList>
</Tour>
```

```svelte
<script lang="ts">
  import TourList from "../TourList/TourList.svelte";
  import TourListItem from "./TourListItem.svelte";

  let active = $state(true);
  let step = $state(0);
</script>

<TourList label="Quick guide" bind:active>
  <TourListItem label="No progress shown" current={step === 0}>
    A step without stepNumber / totalSteps
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Final step" current={step === 1}>
    <button onclick={() => (active = false)}>Close</button>
  </TourListItem>
</TourList>
```

```svelte
<script lang="ts">
  import TourList from "../TourList/TourList.svelte";
  import TourListItem from "./TourListItem.svelte";

  let active = $state(true);
  let step = $state(0);
</script>

<TourList label="Visite" bind:active>
  <TourListItem label="Bienvenue" current={step === 0} stepNumber={1} totalSteps={2}>
    Bonjour !
    <button onclick={() => step++}>Suivant</button>
  </TourListItem>
  <TourListItem label="Fin" current={step === 1} stepNumber={2} totalSteps={2}>
    <button onclick={() => (active = false)}>Terminer</button>
  </TourListItem>
</TourList>
```

## Accessibility

- `role="group"` and `aria-roledescription="step"` identify the element as a tour step.
- `aria-label` includes the step label and a "Step N of M" suffix when available.
- `aria-current="step"` marks the active step for assistive technology.
- Inactive steps are hidden with both `hidden` and `aria-hidden="true"` so they are not announced.
- Consumers should move focus to the current step's content when it becomes active.

## Related components

- `TourList` — the parent ordered list required for composition.
- `Tour` — outer dialog container that wraps the list.
- `TaskListItem` / `TimelineListItem` — alternative `<li>` items for non-tour contexts.
- `Dialog` / `AlertDialog` — simpler modal patterns.
