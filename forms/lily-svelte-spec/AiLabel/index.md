# AiLabel

An inline indicator that marks AI-generated or AI-enhanced content and provides a pathway to AI explainability. Renders a single `<span>` with visible text and an `aria-label`. Inspired by the Carbon Design System AI Label.

## What it is

A headless Svelte 5 component outputting a bare `<span>` with the base class `ai-label`. Category: content metadata / transparency primitive.

## What it does

- Renders `<span class="ai-label {className}" aria-label={label}>{text}</span>`.
- Defaults both `text` and `label` to `"AI"` so it works out of the box.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Inline inside prose to flag an AI-generated summary, answer, or suggestion.
- Beside a chatbot response, generated headline, or AI-assisted recommendation.
- Anywhere transparency about automated content is required.

## When not to use it

- For interactive AI explainability actions — wrap the label in a `Button` or put it inside a `Popover` trigger.
- For a full banner-level disclosure — use `Banner` or `InformationCallout`.
- For category or status badges unrelated to AI — use `Badge` or `Tag`.

## How to use it

Import `AiLabel` from `./AiLabel.svelte`. Optionally override `text` (what users see) and `label` (what screen readers announce).

## Props

- `class` — string, default `""`. CSS class appended to `ai-label`.
- `label` — string, default `"AI"`. Accessible name via `aria-label`.
- `text` — string, default `"AI"`. Visible text inside the span.
- `...restProps` — additional HTML attributes spread onto the `<span>`.

## Usage

### Default indicator inline

```svelte
<script lang="ts">
  import AiLabel from './AiLabel.svelte';
</script>

<p>This summary was created by <AiLabel /> based on your documents.</p>
```

### Custom visible text and label

```svelte
<script lang="ts">
  import AiLabel from './AiLabel.svelte';
</script>

<AiLabel text="AI generated" label="This content was AI generated" />
```

### Localized label

```svelte
<script lang="ts">
  import AiLabel from './AiLabel.svelte';

  const text = 'IA';
  const label = 'Contenu généré par IA';
</script>

<AiLabel {text} {label} />
```

### Wrapped in a button for explainability

```svelte
<script lang="ts">
  import AiLabel from './AiLabel.svelte';

  let showExplain = $state(false);
</script>

<button type="button" onclick={() => (showExplain = !showExplain)}>
  <AiLabel text="AI" label="Open AI explanation" />
</button>
{#if showExplain}<p>This answer was generated using ...</p>{/if}
```

### With data attributes for tracking

```svelte
<AiLabel text="AI" label="AI-generated summary" data-testid="ai-badge" data-source="gpt-5" />
```

## Accessibility

- The `<span>` has no implicit role; `aria-label` provides the accessible name.
- Display-only, no keyboard behavior. Wrap in `<button>` if interactive.
- Consumer-supplied CSS should provide sufficient contrast.
- Follows AI transparency guidance.

## Related components

- `Badge` — short status or count label (non-AI semantics).
- `Tag` — keyword label for categorization.
- `Flair` — decorative inline highlight.
- `Banner` / `InformationCallout` — page-level AI disclosures.
