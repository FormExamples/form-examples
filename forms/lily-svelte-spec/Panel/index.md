# Panel

A headless labeled container for grouping related content. Renders a `<section>` with `aria-label`, creating a named region landmark that assistive technology can enumerate and jump to.

## What it is

- Component: `Panel`
- HTML element: `<section>`
- Role: implicit `region` when named (via `aria-label`)
- Category: layout / landmark container

## What it does

- Renders a `<section aria-label="…">` around its children.
- Creates a named region landmark so screen readers can list and navigate to this area.
- Spreads additional HTML attributes onto the `<section>`.

## When to use it

- Settings pages, dashboards, and multi-section layouts where each group of content benefits from landmark navigation.
- Side-by-side cards where each card represents a distinct topical region.
- Grouping a set of related form fields where a visible heading is not desired.

## When not to use it

- For a generic non-landmark container — use a plain `<div>` or `Card`.
- For structural page regions — use `GrailLayoutTopHeader`, `GrailLayoutCenterMain`, `GrailLayoutLeftAside`, `GrailLayoutRightAside`, `GrailLayoutBottomFooter`.
- For a modal or overlay — use `Dialog`, `Popover`, `Popup`, `Drawer`, or `Sheet`.
- When you need a visible heading as the region's accessible name — use `<section aria-labelledby="…">` directly, since `Panel` applies only `aria-label`.

## How to use it

Import and wrap content. Provide a concise, descriptive `label`.

```svelte
import Panel from './Panel.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `panel`.
- `label`: string, required. Accessible name for the region via `aria-label`.
- `children`: Snippet, required. The panel content.
- `...restProps`: spread onto the `<section>`.

## Usage

### Basic labeled panel

```svelte
<script lang="ts">
  import Panel from './Panel.svelte';
</script>

<Panel label="Settings">
  <p>Adjust your preferences below.</p>
</Panel>
```

### Multiple panels on a page

```svelte
<script lang="ts">
  import Panel from './Panel.svelte';
</script>

<Panel label="Account information">
  <p>Name, email, and profile details.</p>
</Panel>

<Panel label="Notification preferences">
  <p>Choose how you want to be notified.</p>
</Panel>
```

### Panel containing a form

```svelte
<script lang="ts">
  import Panel from './Panel.svelte';
  import TextInput from '../TextInput/TextInput.svelte';
  import Button from '../Button/Button.svelte';

  let name = $state("");
</script>

<Panel label="Profile">
  <TextInput label="Name" bind:value={name} />
  <Button type="button">Save</Button>
</Panel>
```

### Panel with a heading inside

```svelte
<script lang="ts">
  import Panel from './Panel.svelte';
</script>

<Panel label="Recent activity">
  <h2>Recent activity</h2>
  <ul>
    <li>Signed in — 10:24</li>
    <li>Updated profile — 10:36</li>
  </ul>
</Panel>
```

### Panel as a dashboard card

```svelte
<script lang="ts">
  import Panel from './Panel.svelte';
</script>

<Panel label="System status" data-tone="ok">
  <p>All systems operational.</p>
</Panel>
```

## Accessibility

- `<section aria-label="…">` is a named region landmark. Keep the `label` short, descriptive, and unique on the page.
- Assistive technology users can navigate among landmarks; multiple named `Panel`s should each have distinct labels.
- Do not rely on `Panel` alone for grouped form controls with a shared legend — use `Fieldset` for that pattern.

## Related components

- `Card` — visually grouped content container without a landmark role.
- `Fieldset` — grouped form controls with a `<legend>`.
- `GrailLayoutCenterMain`, `GrailLayoutLeftAside`, `GrailLayoutRightAside` — page-structural landmarks.
- `Dialog`, `Popover`, `Popup`, `Drawer` — overlay alternatives.

---

Lily™ and Lily Design System™ are trademarks.
