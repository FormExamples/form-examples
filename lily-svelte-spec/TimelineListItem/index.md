# TimelineListItem

A single event entry inside a `TimelineList`, rendering a semantic `<li>` with an optional `<time>` element for machine-readable dates and event content via `children`.

## What it is

`TimelineListItem` is a headless Svelte 5 component representing one event in a chronological list. It renders an `<li>` and, when either `datetime` or `heading` is provided, a nested `<time>` element for machine-readable dates with human-readable text.

## What it does

- Renders `<li class="timeline-list-item {className}">`.
- If `datetime` or `heading` is set, renders a `<time datetime={datetime || undefined}>{heading}</time>` before the children.
- Renders the `children` snippet after the optional `<time>`.
- Spreads additional HTML attributes onto the `<li>`.

## When to use it

- Inside a `TimelineList` for each event in a chronological display.
- Order history steps, release entries, audit log rows, activity feed items.
- Any item that needs a semantic date/time pairing with event content.

## When not to use it

- Don't use it outside a `TimelineList` (or plain `<ol>`/`<ul>`) — `<li>` is invalid elsewhere.
- Don't use it for todo-style tasks — use `TaskListItem`.
- Don't use it when you need a full `Card` layout — compose a `Card` per event instead.
- Don't use it for summary rows — use `SummaryListItem`.

## How to use it

Import and place inside a `TimelineList`. Set `datetime` (ISO) and `heading` (visible label) to show a `<time>` element, or omit both to render content without a time stamp.

## Props

- `class` — string, optional. Extra CSS class appended to `timeline-list-item`.
- `datetime` — string, optional. ISO date/time string for the `<time>` element.
- `heading` — string, optional. Visible text rendered inside the `<time>` element.
- `children` — Snippet, required. Event description content.
- `...restProps` — any additional HTML attributes spread onto the `<li>`.

## Usage

```svelte
<script lang="ts">
  import TimelineList from "../TimelineList/TimelineList.svelte";
  import TimelineListItem from "./TimelineListItem.svelte";
</script>

<TimelineList label="Order history">
  <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
    Order placed
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-19" heading="January 19, 2024">
    Order delivered
  </TimelineListItem>
</TimelineList>
```

```svelte
<script lang="ts">
  import TimelineList from "../TimelineList/TimelineList.svelte";
  import TimelineListItem from "./TimelineListItem.svelte";
</script>

<TimelineList label="Release notes">
  <TimelineListItem datetime="2024-04-01" heading="v1.0">
    <h3>Initial release</h3>
    <p>Core features shipped.</p>
  </TimelineListItem>
  <TimelineListItem datetime="2024-05-15" heading="v1.1">
    <h3>Performance updates</h3>
    <p>Faster rendering.</p>
  </TimelineListItem>
</TimelineList>
```

```svelte
<script lang="ts">
  import TimelineList from "../TimelineList/TimelineList.svelte";
  import TimelineListItem from "./TimelineListItem.svelte";
</script>

<TimelineList label="Activity">
  <TimelineListItem>Status pending review</TimelineListItem>
  <TimelineListItem heading="Just now">Comment added</TimelineListItem>
</TimelineList>
```

```svelte
<script lang="ts">
  import TimelineList from "../TimelineList/TimelineList.svelte";
  import TimelineListItem from "./TimelineListItem.svelte";

  const events = [
    { at: "2024-07-01T09:15:00Z", heading: "9:15 AM", msg: "Signed in" },
    { at: "2024-07-01T09:20:00Z", heading: "9:20 AM", msg: "Viewed dashboard" },
  ];
</script>

<TimelineList label="Session activity">
  {#each events as e (e.at)}
    <TimelineListItem datetime={e.at} heading={e.heading} data-type="session">
      {e.msg}
    </TimelineListItem>
  {/each}
</TimelineList>
```

## Accessibility

- Semantic `<li>` provides listitem semantics inside the parent `<ol>`.
- `<time datetime="…">` makes dates machine-readable for user agents and indexing tools.
- Screen readers announce the item's position within the list.
- Inactive interactive elements inside children participate in normal tab order.

## Related components

- `TimelineList` — the parent container; required for correct composition.
- `TaskListItem` — task-style list item with checkbox.
- `SummaryListItem` — key-value summary row.
- `EndNotes` — end-of-article notes list.
