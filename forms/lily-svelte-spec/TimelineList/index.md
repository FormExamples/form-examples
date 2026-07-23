# TimelineList

An ordered list of chronological events, rendered as a semantic `<ol>` with an accessible `aria-label`, designed to contain `TimelineListItem` children.

## What it is

`TimelineList` is a headless Svelte 5 container that renders an `<ol>` element with an `aria-label`. It is the parent in the `TimelineList` → `TimelineListItem` composition pattern used for activity feeds, order histories, release notes, and user journeys.

## What it does

- Renders `<ol class="timeline-list {className}" aria-label={label}>`.
- Renders the supplied `children` snippet inside the `<ol>`.
- Spreads additional HTML attributes onto the `<ol>`.

## When to use it

- Project milestone / release history displays.
- Activity feeds and audit logs.
- Order status tracking and shipment timelines.
- User-journey visualization (signup → onboarding → upgrade).

## When not to use it

- Don't use it for navigation — use `TreeNav` or `BreadcrumbNav`.
- Don't use it for tasks requiring checkboxes — use `TaskList`/`TaskListItem`.
- Don't use it for a kanban or Gantt style view — use `KanbanTable` or `GanttTable`.
- Don't use it to render a single event — a plain `<p>` or `<time>` is sufficient.

## How to use it

Import `TimelineList` plus `TimelineListItem`, pass an accessible `label`, and provide one item per event. Each item can set `datetime` (ISO string) and `heading` (visible date text).

## Props

- `class` — string, optional. Extra CSS class appended to `timeline-list`.
- `label` — string, required. Accessible label via `aria-label`.
- `children` — Snippet, required. `TimelineListItem` elements.
- `...restProps` — any additional HTML attributes spread onto the `<ol>`.

## Usage

```svelte
<script lang="ts">
  import TimelineList from "./TimelineList.svelte";
  import TimelineListItem from "../TimelineListItem/TimelineListItem.svelte";
</script>

<TimelineList label="Order history">
  <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
    Order placed
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-16" heading="January 16, 2024">
    Order shipped
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-19" heading="January 19, 2024">
    Order delivered
  </TimelineListItem>
</TimelineList>
```

```svelte
<script lang="ts">
  import TimelineList from "./TimelineList.svelte";
  import TimelineListItem from "../TimelineListItem/TimelineListItem.svelte";

  const events = [
    { at: "2024-03-01", heading: "Mar 1", msg: "Project kickoff" },
    { at: "2024-04-15", heading: "Apr 15", msg: "MVP release" },
    { at: "2024-06-01", heading: "Jun 1", msg: "v1.0 launch" },
  ];
</script>

<TimelineList label="Project milestones">
  {#each events as e (e.at)}
    <TimelineListItem datetime={e.at} heading={e.heading}>
      {e.msg}
    </TimelineListItem>
  {/each}
</TimelineList>
```

```svelte
<script lang="ts">
  import TimelineList from "./TimelineList.svelte";
  import TimelineListItem from "../TimelineListItem/TimelineListItem.svelte";
</script>

<TimelineList label="Activity feed">
  <TimelineListItem datetime="2024-07-01T09:15:00Z" heading="9:15 AM">
    <strong>Alice</strong> commented on <a href="/issue/1">#1</a>
  </TimelineListItem>
  <TimelineListItem>Status pending review</TimelineListItem>
</TimelineList>
```

```svelte
<script lang="ts">
  import TimelineList from "./TimelineList.svelte";
  import TimelineListItem from "../TimelineListItem/TimelineListItem.svelte";
</script>

<TimelineList label="Historique" data-testid="fr-history">
  <TimelineListItem datetime="2024-01-15" heading="15 janvier 2024">
    Commande passée
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-19" heading="19 janvier 2024">
    Commande livrée
  </TimelineListItem>
</TimelineList>
```

## Accessibility

- Semantic `<ol>` conveys chronological ordering to screen readers.
- `aria-label` provides the list's accessible name; always pass one.
- Screen readers announce list position ("2 of 4") from within each item.
- Consumers should pass ISO `datetime` to items for machine-readable dates.

## Related components

- `TimelineListItem` — child entry component; required for proper composition.
- `TaskList` / `TaskListItem` — ordered tasks with checkboxes.
- `SummaryList` / `SummaryListItem` — key-value summary pairs.
- `EndNotes` — titled endnote section at the end of an article.

---

Lily™ and Lily Design System™ are trademarks.
