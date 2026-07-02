# InformationCallout

InformationCallout is a headless Svelte 5 component that highlights important information in a semantically distinct container. It renders an `<aside>` element with `role="note"` and an accessible label, making the callout content identifiable to assistive technologies as supplementary information.

## What it is

A passive, structural container component that wraps arbitrary child content inside a semantic `<aside>` element with `role="note"`. It has no visual styling, no state, and no interactive behavior — consumers supply both the CSS and the content.

## What it does

- Renders an `<aside>` element with `class="information-callout"` plus any consumer-provided CSS class.
- Applies `role="note"` so screen readers announce the content as supplementary information.
- Applies `aria-label` from the required `label` prop to describe the nature of the callout (e.g., "Note", "Warning", "Tip").
- Renders the required `children` snippet as the callout body.
- Spreads `...restProps` onto the `<aside>` so consumers can add any additional HTML attributes.

## When to use it

- Highlighting notices, tips, warnings, or beta feature announcements alongside main content.
- Calling out eligibility criteria, processing times, or supplementary guidance in a form.
- Surfacing optional-but-relevant information that should not interrupt the main reading flow.
- Grouping a set of callout variants (info, warning, tip) by varying the `label` prop and consumer CSS.

## When not to use it

- Do not use for urgent, time-sensitive alerts that require immediate user attention — use `Alert` or `AlertDialog` instead.
- Do not use for primary page content — the `role="note"` semantic implies supplementary content.
- Do not use for inline emphasis on a single sentence — use `InsetText` or `Flair`.
- Do not use for form-field hint text — use `Hint` associated with the field via `aria-describedby`.

## How to use it

Import the component, pass a descriptive `label`, and render arbitrary content via the `children` snippet. Provide your own CSS targeting `.information-callout` or a consumer class name.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `information-callout` class.
- `label` (string, required) — accessible name for the callout applied via `aria-label`.
- `children` (Snippet, required) — callout content to display inside the `<aside>`.
- `...restProps` (unknown) — any additional HTML attributes spread onto the `<aside>` element.

## Usage

### Basic note callout

```svelte
<script lang="ts">
    import InformationCallout from "./InformationCallout.svelte";
</script>

<InformationCallout label="Note">
    <p>This feature is in beta.</p>
</InformationCallout>
```

### Warning callout

```svelte
<script lang="ts">
    import InformationCallout from "./InformationCallout.svelte";
</script>

<InformationCallout label="Warning">
    <p>Changes cannot be undone after submission.</p>
</InformationCallout>
```

### Tip callout with structured content

```svelte
<script lang="ts">
    import InformationCallout from "./InformationCallout.svelte";
</script>

<InformationCallout label="Tip">
    <h3>Pro tip</h3>
    <p>Press <kbd>Cmd</kbd>+<kbd>K</kbd> to open the command palette.</p>
</InformationCallout>
```

### Consumer-styled callout variant

```svelte
<script lang="ts">
    import InformationCallout from "./InformationCallout.svelte";
</script>

<InformationCallout class="callout-brand" label="Did you know?">
    <p>You can export your data at any time from the settings page.</p>
</InformationCallout>

<style>
    :global(.callout-brand) {
        border-left: 4px solid #2563eb;
        padding: 1rem;
        background: #eff6ff;
    }
</style>
```

### Dynamic callout from state

```svelte
<script lang="ts">
    import InformationCallout from "./InformationCallout.svelte";
    let status = $state<"info" | "warning">("info");
    const labels = { info: "Note", warning: "Warning" };
</script>

<InformationCallout label={labels[status]} data-type={status}>
    <p>Current status: {status}</p>
</InformationCallout>
```

## Accessibility

- `role="note"` identifies the content as a note or supplementary information (WAI-ARIA note role).
- `aria-label` provides an accessible name describing the type of callout.
- No keyboard interaction required — the component is a passive container.
- Consumers must ensure sufficient colour contrast when styling the callout visually.
- Compliant with WCAG 2.2 AAA for non-interactive regions.

## Related components

- `InsetText` — a simpler `<div role="note">` for inline-indented supplementary text.
- `Alert` — a status message for important feedback (`role="alert"` / `role="status"`).
- `WarningCallout` — a dedicated callout for warning messages.
- `Banner` — a prominent message bar across the top of a page.
- `Notification` — a brief message about an event or update.
