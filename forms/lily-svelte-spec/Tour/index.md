# Tour

A conditionally rendered modal dialog that wraps a `TourList` → `TourListItem` guided walkthrough, rendering as `<div role="dialog" aria-modal="true">` and closing on `Escape`.

## What it is

`Tour` is a headless Svelte 5 container for a guided walkthrough experience — onboarding flows, feature tutorials, or contextual help. It provides the dialog overlay semantics and keyboard dismissal, while the actual steps are rendered inside through a `TourList` with `TourListItem` children.

## What it does

- When `active` is true, renders `<div class="tour {className}" role="dialog" aria-modal="true" aria-label={label} tabindex="-1">`.
- When `active` is false, renders nothing (fully removed from DOM).
- Listens for `Escape` keydown on the dialog and sets `active = false` to dismiss.
- Binds `active` via `$bindable` for two-way control by the consumer.
- Renders the `children` snippet inside — typically a `TourList` with `TourListItem` steps.
- Spreads additional HTML attributes onto the `<div>`.

## When to use it

- First-run onboarding tours.
- Feature-release walkthroughs introducing new capabilities.
- Contextual multi-step help in complex dashboards.
- Any experience that guides a user through sequenced steps.

## When not to use it

- Don't use it for a single modal confirmation — use `AlertDialog` or `Dialog`.
- Don't use it for inline hints — use `Hint` or `Tooltip`.
- Don't use it for popovers/coachmarks that should not trap interaction — use `Popover` or `HoverCard`.
- Don't use it for static tabs-through content — use `TabBar` / `TabBarButton`.

## How to use it

Import `Tour`, `TourList`, and `TourListItem`. Bind `active`, track a `step` index, and mark the current `TourListItem` with `current={step === n}`.

## Props

- `class` — string, optional. Extra CSS class appended to `tour`.
- `label` — string, required. Accessible name for the dialog via `aria-label`.
- `active` — boolean, default `false`, bindable via `bind:active`. Whether the tour is visible.
- `children` — Snippet, required. `TourList` and `TourListItem` elements.
- `...restProps` — any additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
  import Tour from "./Tour.svelte";
  import TourList from "../TourList/TourList.svelte";
  import TourListItem from "../TourListItem/TourListItem.svelte";

  let active = $state(true);
  let step = $state(0);
</script>

<Tour label="Getting started" bind:active>
  <TourList label="Steps" active>
    <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={2}>
      <p>Welcome!</p>
      <button type="button" onclick={() => step++}>Next</button>
    </TourListItem>
    <TourListItem label="Finish" current={step === 1} stepNumber={2} totalSteps={2}>
      <p>You're all set.</p>
      <button type="button" onclick={() => (active = false)}>Done</button>
    </TourListItem>
  </TourList>
</Tour>
```

```svelte
<script lang="ts">
  import Tour from "./Tour.svelte";
  import TourList from "../TourList/TourList.svelte";
  import TourListItem from "../TourListItem/TourListItem.svelte";

  let active = $state(false);
  let step = $state(0);
</script>

<button type="button" onclick={() => { step = 0; active = true; }}>
  Replay tour
</button>

<Tour label="Onboarding tour" bind:active>
  <TourList label="Tour steps" active>
    <TourListItem label="Intro" current={step === 0} stepNumber={1} totalSteps={3}>
      Step 1 <button onclick={() => step++}>Next</button>
    </TourListItem>
    <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
      Step 2 <button onclick={() => step++}>Next</button>
    </TourListItem>
    <TourListItem label="Wrap up" current={step === 2} stepNumber={3} totalSteps={3}>
      Step 3 <button onclick={() => (active = false)}>Finish</button>
    </TourListItem>
  </TourList>
</Tour>
```

```svelte
<script lang="ts">
  import Tour from "./Tour.svelte";
  import TourList from "../TourList/TourList.svelte";
  import TourListItem from "../TourListItem/TourListItem.svelte";

  let active = $state(true);
  let step = $state(0);
  const steps = [
    { label: "Bienvenue", body: "Bonjour !" },
    { label: "Terminer", body: "Fin du tour." },
  ];
</script>

<Tour label="Visite guidée" bind:active>
  <TourList label="Étapes" active>
    {#each steps as s, i}
      <TourListItem label={s.label} current={step === i} stepNumber={i + 1} totalSteps={steps.length}>
        <p>{s.body}</p>
        {#if i < steps.length - 1}
          <button onclick={() => step++}>Suivant</button>
        {:else}
          <button onclick={() => (active = false)}>Terminer</button>
        {/if}
      </TourListItem>
    {/each}
  </TourList>
</Tour>
```

```svelte
<script lang="ts">
  import Tour from "./Tour.svelte";
  import TourList from "../TourList/TourList.svelte";
  import TourListItem from "../TourListItem/TourListItem.svelte";

  let active = $state(true);
  let step = $state(0);
</script>

<Tour label="Tour" bind:active data-testid="tour">
  <TourList label="Steps" active>
    <TourListItem label="Step A" current={step === 0} stepNumber={1} totalSteps={1}>
      Press Escape to dismiss
    </TourListItem>
  </TourList>
</Tour>
```

## Accessibility

- `role="dialog"` + `aria-modal="true"` marks the overlay as a modal dialog.
- `aria-label` provides the accessible name.
- `tabindex="-1"` allows the dialog to receive focus programmatically (consumers should move focus into the dialog when it opens).
- `Escape` dismisses by flipping `active` to `false`.
- Consumers should implement their own focus trap and backdrop if required.

## Related components

- `TourList` — the ordered list inside the tour overlay.
- `TourListItem` — individual steps within the tour.
- `Dialog` / `AlertDialog` — simpler single-message modal dialogs.
- `Drawer` / `Sheet` — side-panel alternatives.

---

Lily™ and Lily Design System™ are trademarks.
