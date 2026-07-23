# TourList

A conditionally rendered ordered list acting as a modal dialog overlay for guided walkthrough steps, rendered as `<ol role="dialog" aria-modal="true">` and dismissed on `Escape`.

## What it is

`TourList` is a headless Svelte 5 component that renders an `<ol>` styled as a dialog when `active` is true. It is designed to hold `TourListItem` children representing each step of a guided walkthrough. It may be used as the child of a `Tour` wrapper or directly as its own dialog container.

## What it does

- When `active` is true, renders `<ol class="tour-list {className}" role="dialog" aria-modal="true" aria-label={label} tabindex="-1">`.
- When `active` is false, renders nothing.
- Listens for `Escape` and sets `active = false`.
- Binds `active` via `$bindable`.
- Renders the `children` snippet inside — typically `TourListItem` elements.
- Spreads additional HTML attributes onto the `<ol>`.

## When to use it

- Onboarding walkthroughs and feature tutorials.
- Multi-step help flows that should overlay the page.
- Any sequential guided UI where the steps are ordered.

## When not to use it

- Don't use it for single modal messages — use `Dialog` or `AlertDialog`.
- Don't use it outside the Tour composition — use `TaskList` for task items or `TimelineList` for chronological events.
- Don't use it for inline non-modal hints — use `Tooltip` or `Hint`.
- Don't use it for multi-panel tab switching — use `TabBar`/`TabBarButton`.

## How to use it

Import and place inside `Tour` (or use standalone with your own trigger), passing a translated `label`. Bind `active` to control visibility.

## Props

- `class` — string, optional. Extra CSS class appended to `tour-list`.
- `label` — string, required. Accessible name via `aria-label`.
- `active` — boolean, default `false`, bindable via `bind:active`. Whether the tour is visible.
- `children` — Snippet, required. `TourListItem` elements.
- `...restProps` — any additional HTML attributes spread onto the `<ol>`.

## Usage

```svelte
<script lang="ts">
  import TourList from "./TourList.svelte";
  import TourListItem from "../TourListItem/TourListItem.svelte";

  let active = $state(true);
  let step = $state(0);
</script>

<TourList label="Getting started" bind:active>
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
  import TourList from "./TourList.svelte";
  import TourListItem from "../TourListItem/TourListItem.svelte";

  let active = $state(true);
  let step = $state(0);
</script>

<Tour label="Tour" bind:active>
  <TourList label="Steps" active>
    <TourListItem label="Intro" current={step === 0} stepNumber={1} totalSteps={3}>
      Step 1 <button onclick={() => step++}>Next</button>
    </TourListItem>
    <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
      Step 2 <button onclick={() => step++}>Next</button>
    </TourListItem>
    <TourListItem label="Wrap up" current={step === 2} stepNumber={3} totalSteps={3}>
      <button onclick={() => (active = false)}>Done</button>
    </TourListItem>
  </TourList>
</Tour>
```

```svelte
<script lang="ts">
  import TourList from "./TourList.svelte";
  import TourListItem from "../TourListItem/TourListItem.svelte";

  let active = $state(false);
  let step = $state(0);
</script>

<button onclick={() => { step = 0; active = true; }}>Launch tour</button>

<TourList label="Site tour" bind:active>
  <TourListItem label="Dashboard" current={step === 0} stepNumber={1} totalSteps={2}>
    Dashboard overview <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Settings" current={step === 1} stepNumber={2} totalSteps={2}>
    Settings overview <button onclick={() => (active = false)}>Close</button>
  </TourListItem>
</TourList>
```

```svelte
<script lang="ts">
  import TourList from "./TourList.svelte";
  import TourListItem from "../TourListItem/TourListItem.svelte";

  const steps = [
    { label: "Step 1", body: "Intro" },
    { label: "Step 2", body: "Outro" },
  ];
  let active = $state(true);
  let step = $state(0);
</script>

<TourList label="Guided tour" bind:active>
  {#each steps as s, i}
    <TourListItem
      label={s.label}
      current={step === i}
      stepNumber={i + 1}
      totalSteps={steps.length}
    >
      {s.body}
      {#if i < steps.length - 1}
        <button onclick={() => step++}>Next</button>
      {:else}
        <button onclick={() => (active = false)}>Finish</button>
      {/if}
    </TourListItem>
  {/each}
</TourList>
```

## Accessibility

- `role="dialog"` + `aria-modal="true"` identify the overlay as a modal.
- `aria-label` provides the accessible name.
- `tabindex="-1"` allows programmatic focus.
- `Escape` dismisses by flipping `active` to `false`.
- Note that using `role="dialog"` on an `<ol>` is an ARIA override; consumers should ensure the inner steps use `role="group"` with `aria-roledescription="step"` (as `TourListItem` does).

## Related components

- `Tour` — outer container providing the same dialog semantics at the `<div>` level.
- `TourListItem` — step child components.
- `TaskList` / `TimelineList` — ordered lists for non-tour contexts.
- `Dialog` — general-purpose dialog component.

---

Lily™ and Lily Design System™ are trademarks.
