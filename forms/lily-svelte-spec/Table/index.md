# Table

A headless semantic table with an accessible label. Renders `<table>` and defers all header/body/footer structure to the consumer.

## What it is

A Svelte 5 headless component that renders `<table class="table ...">` with `aria-label`. The consumer provides `<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, and `<tfoot>` (or equivalent components like `TableHead`, `TableBody`, `TableRow`, `TableTD`, `TableTD`) through `children`.

## What it does

- Renders a semantic `<table>`.
- Attaches the required `aria-label`.
- Spreads `...restProps` onto the `<table>`.
- Delegates all table structure and content to the consumer.

No sorting, filtering, or pagination is built in.

## When to use it

- Generic tabular data presentation.
- When you do not need the extra semantics of `DataTable`, `CalendarTable`, `GanttTable`, or `KanbanTable`.
- As a foundation for custom table layouts.

## When not to use it

- Sortable/filterable data grids - use `DataTable`.
- Calendars - use `CalendarTable`.
- Gantt charts - use `GanttTable`.
- Kanban boards - use `KanbanTable`.
- Key-value summaries - use `SummaryList`.

## How to use it

1. Import `Table` and (optionally) the companion subcomponents.
2. Provide a translated `label`.
3. Place `thead`/`tbody`/`tfoot` (or the component equivalents) inside `children`.

## Props

- `class` (string, optional, default `""`) - merged with the base `table` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - table content.
- `...restProps` - spread onto the `<table>`.

## Usage

Simple table with native elements:

```svelte
<script lang="ts">
    import Table from "./Table.svelte";
</script>

<Table label="User accounts">
    <thead>
        <tr><th scope="col">Name</th><th scope="col">Email</th></tr>
    </thead>
    <tbody>
        <tr><td>Alice</td><td>alice@example.com</td></tr>
        <tr><td>Bob</td><td>bob@example.com</td></tr>
    </tbody>
</Table>
```

Using the companion components:

```svelte
<script lang="ts">
    import Table from "./Table.svelte";
    import TableHead from "../TableHead/TableHead.svelte";
    import TableBody from "../TableBody/TableBody.svelte";
    import TableRow from "../TableRow/TableRow.svelte";
    import TableTD from "../TableTD/TableTD.svelte";
    import TableTD from "../TableTD/TableTD.svelte";
</script>

<Table label="Tasks">
    <TableHead>
        <TableRow>
            <TableTD>Task</TableTD>
            <TableTD>Status</TableTD>
        </TableRow>
    </TableHead>
    <TableBody>
        <TableRow>
            <TableTD>Write docs</TableTD>
            <TableTD>In progress</TableTD>
        </TableRow>
    </TableBody>
</Table>
```

With a visible caption:

```svelte
<script lang="ts">
    import Table from "./Table.svelte";
</script>

<Table label="Q1 sales">
    <caption>Sales by region (Q1 2026)</caption>
    <thead>
        <tr><th scope="col">Region</th><th scope="col">Sales</th></tr>
    </thead>
    <tbody>
        <tr><td>NA</td><td>$1.2M</td></tr>
    </tbody>
</Table>
```

With row headers:

```svelte
<script lang="ts">
    import Table from "./Table.svelte";
</script>

<Table label="Employees">
    <thead>
        <tr><th scope="col">Name</th><th scope="col">Title</th></tr>
    </thead>
    <tbody>
        <tr><th scope="row">Alice</th><td>Engineer</td></tr>
        <tr><th scope="row">Bob</th><td>Designer</td></tr>
    </tbody>
</Table>
```

Dynamic rows from data:

```svelte
<script lang="ts">
    import Table from "./Table.svelte";
    const rows = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
    ];
</script>

<Table label="Users">
    <thead>
        <tr><th scope="col">ID</th><th scope="col">Name</th></tr>
    </thead>
    <tbody>
        {#each rows as r (r.id)}
            <tr><td>{r.id}</td><td>{r.name}</td></tr>
        {/each}
    </tbody>
</Table>
```

## Accessibility

- Semantic `<table>` is announced correctly by screen readers.
- `aria-label` supplies the accessible name; alternatively add a `<caption>` for a visible title.
- Use `<th scope="col">` for column headers and `<th scope="row">` for row headers.
- The component does not enforce any particular structure; valid table HTML is the consumer's responsibility.

References:
- WAI-ARIA Table Role: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- MDN `<table>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table

## Related components

- `TableHead`, `TableBody`, `TableFoot`, `TableRow`, `TableTD`, `TableTD` - structural building blocks.
- `DataTable` - sortable data grid.
- `CalendarTable`, `GanttTable`, `KanbanTable` - specialized tables.
- `SummaryList` - key-value pair alternative.
