# Badge

A small inline label for counts, statuses, or categories. Renders a `<span role="status">` with severity variant exposed via `data-type` and an optional `aria-label` for screen-reader context.

## What it is

A headless Svelte 5 component outputting a single `<span>`. Category: small-label primitive alongside `Tag`, `Flair`, and `AiLabel`.

## What it does

- Renders `<span class="badge {className}" role="status" aria-label={label} data-type={type}>`.
- Applies `aria-label` only when `label` is provided (for cases where the visible text lacks context, e.g. `"3"` → `"3 unread messages"`).
- Exposes `data-type` for CSS styling hooks.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Notification counts on a bell icon.
- "New", "Beta", "Draft" micro-labels.
- Status pills (Success, Error, Warning) inline with text.
- Category tags where `role="status"` semantics are acceptable.

## When not to use it

- For interactive category toggles — use `Tag` / `TagGroup`.
- For AI indication — use `AiLabel`.
- For decorative highlight — use `Flair`.
- For persistent prominent messaging — use `Alert` or `Banner`.
- For a page-wide count that auto-updates aloud — prefer a dedicated `aria-live` region.

## How to use it

Import `Badge` from `./Badge.svelte`. Provide children for the visible content. Optionally pass `type` for semantic variant and `label` for extra screen-reader context.

## Props

- `class` — string, default `""`. CSS class appended to `badge`.
- `type` — `"default" | "info" | "success" | "warning" | "error"`, default `"default"`.
- `label` — string, optional. Accessible name override.
- `children` — `Snippet`, required. Badge content.
- `...restProps` — additional HTML attributes spread onto the `<span>`.

## Usage

### Simple text badge

```svelte
<script lang="ts">
  import Badge from './Badge.svelte';
</script>

<Badge>New</Badge>
```

### Count badge with accessible context

```svelte
<script lang="ts">
  import Badge from './Badge.svelte';

  let unread = $state(3);
</script>

<Badge label="{unread} unread messages">{unread}</Badge>
```

### Status variants

```svelte
<script lang="ts">
  import Badge from './Badge.svelte';
</script>

<Badge type="info">Info</Badge>
<Badge type="success">Saved</Badge>
<Badge type="warning">Pending</Badge>
<Badge type="error">Failed</Badge>
```

### Inside a button label

```svelte
<script lang="ts">
  import Badge from './Badge.svelte';
  import Button from '../Button/Button.svelte';

  let unread = $state(12);
</script>

<Button>
  Messages <Badge label="{unread} unread">{unread}</Badge>
</Button>
```

### Reactive status

```svelte
<script lang="ts">
  import Badge from './Badge.svelte';

  let status = $state<'success' | 'warning' | 'error'>('success');
  let text = $derived({ success: 'Online', warning: 'Degraded', error: 'Offline' }[status]);
</script>

<Badge type={status}>{text}</Badge>
```

## Accessibility

- `role="status"` creates a polite live region so changes are announced at a natural pause.
- `aria-label` gives screen readers full context when the visible text is minimal.
- `data-type` is for styling only.
- Not interactive — not keyboard reachable by default.

## Related components

- `Tag`, `TagGroup` — interactive keyword labels.
- `AiLabel` — AI transparency indicator.
- `Flair` — decorative inline highlight.
- `Character` — single character display.
- `Alert`, `Notification`, `Toast` — larger feedback surfaces.
