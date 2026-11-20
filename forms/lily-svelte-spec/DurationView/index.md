# DurationView

A length of time, as an ISO 8601 duration in a `<time>` element, shown in the consumer's words (tasks.md P29-T6). The canonical
contract is `components/duration-view/index.md`.

## Props

- `class`: string (optional) -- CSS class appended to `duration-view`
- `value`: string (required) -- the length of time as the consumer writes it
- `duration`: string (required) -- the same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative; rendered as `datetime` (a negative one adds `data-negative`; years, months and weeks render no `datetime`)
- `label`: string (optional) -- hidden text naming the value

## Usage

```svelte
<DurationView
  label="Length of stay"
  value="3 days 4 hours"
  duration="P3DT4H"
/>
```
