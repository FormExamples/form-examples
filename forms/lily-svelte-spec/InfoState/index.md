# InfoState

A composition of optional illustration, required title, optional description, and optional action — useful for empty states, error states, success states, and informational placeholder views. This headless Svelte component renders a `<section>` with `role="status"` and a configurable `data-level`.

## What it is

A headless Svelte 5 component that renders a single `<section>` element. Category: feedback / messaging.

## What it does

- Renders a `<section>` with the base class `info-state` plus consumer `class`.
- Applies `role="status"` so assistive tech announces non-disruptive updates.
- Sets `data-level` from the `level` prop (info, empty, error, success).
- Renders an optional `illustration` snippet, then the required `title` in an `<h2>`, then an optional `description` `<p>`, then an optional `action` snippet.
- If `children` is provided, renders that snippet exclusively (custom layout override).
- `aria-label` defaults to `title` and may be overridden by `label`.

## When to use it

- Empty list, search, or table states.
- Recoverable error screens with a retry CTA.
- Onboarding placeholders prompting the user to take a first action.
- Success confirmations after multi-step flows.

## When not to use it

- For an urgent, blocking error, use `AlertDialog`.
- For a brief, auto-dismissing message, use `Toast`.
- For a contextual inline error, use `ErrorMessage`.

## Props

- `class` — string, default `""`. CSS class appended to `info-state`.
- `level` — `"info" | "empty" | "error" | "success"`, default `"info"`. Sets `data-level`.
- `title` — string, **required**. Heading text.
- `description` — string, optional. Body text.
- `label` — string, optional. Accessible label override (defaults to `title`).
- `illustration` — `Snippet`, optional. Visual element above the title.
- `action` — `Snippet`, optional. Call-to-action below the description.
- `children` — `Snippet`, optional. Custom default content (overrides default layout).
- `...restProps` — additional HTML attributes spread onto the `<section>`.

## Usage

### Empty state

```svelte
<script lang="ts">
  import InfoState from './InfoState.svelte';
</script>

<InfoState level="empty" title="No results found" description="Try a different search term." />
```

### Error state with retry action

```svelte
<script lang="ts">
  import InfoState from './InfoState.svelte';
  import Button from '../Button/Button.svelte';

  function retry() { /* … */ }
</script>

<InfoState level="error" title="Something went wrong" description="Please try again.">
  {#snippet action()}
    <Button onclick={retry}>Retry</Button>
  {/snippet}
</InfoState>
```

## Accessibility

- `role="status"` causes assistive tech to announce updates politely.
- The `<h2>` provides a heading anchor for screen-reader navigation.
- `aria-label` is the section's accessible name; defaults to the title.

## Related components

- `Alert` — inline status message.
- `AlertDialog` — modal alert dialog.
- `Toast` — brief auto-dismissing notification.
- `ErrorMessage` — inline error message for form fields.

## References

- WAI-ARIA `role="status"`: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
- MDN `<section>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
