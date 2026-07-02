# StatusLight

A small colored dot status indicator paired with a status label.

## What it is

A headless Svelte 5 component that renders `<span class="status-light" role="status" data-variant>` containing an `aria-hidden` dot span and a visible label span. Inspired by Adobe Spectrum's StatusLight.

## What it does

- Sets `role="status"` so the label is announced when the status appears or changes.
- Exposes the `variant` as `data-variant` for consumer styling.
- Hides the dot from assistive technology with `aria-hidden="true"`.

## When to use it

- Indicating a discrete state next to a label (Active, Offline, Pending, etc.).
- Status indicators in lists or tables.

## When not to use it

- For numeric counts or labels, use `Badge`.
- For interactive toggling, use `SwitchButton` or `ToggleButton`.

## Props

- `class` — string, default `""`.
- `variant` — `"neutral" | "informative" | "positive" | "notice" | "negative" | "active" | "inactive"`, default `"neutral"`.
- `label` — string, **required**. Visible status text.

## Usage

```svelte
<script lang="ts">
  import StatusLight from './StatusLight.svelte';
</script>

<StatusLight variant="positive" label="Active" />
<StatusLight variant="negative" label="Offline" />
```

## Accessibility

- `role="status"` makes the label announceable to assistive tech.
- The dot is `aria-hidden` so it is not announced separately.
- Color alone does not convey the status — the label is required.

## Related components

- `Badge` — count or label tag.
- `Tag` — keyword label for categorization.

## References

- Adobe Spectrum StatusLight: https://spectrum.adobe.com/page/status-light/
