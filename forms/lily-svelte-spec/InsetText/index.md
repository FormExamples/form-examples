# InsetText

InsetText is a headless Svelte 5 component that distinguishes a block of text from surrounding content, drawing attention to important information a user needs to know. It renders a `<div>` with `role="note"` and is inspired by the GOV.UK and NHS England "inset text" patterns.

## What it is

A passive container that wraps arbitrary child content in a semantic `<div role="note">`. It carries no visual styling, no state, and no keyboard behaviour — consumers supply their own CSS (typically a left border and indentation).

## What it does

- Renders a `<div>` with `class="inset-text"` plus any consumer-provided CSS class.
- Applies `role="note"` so screen readers announce the content as supplementary information.
- Renders the required `children` snippet as the inset body.
- Spreads `...restProps` onto the `<div>` for consumer customization.

## When to use it

- Drawing attention to supplementary information such as processing times, eligibility criteria, or important notices embedded within body copy.
- Presenting a short paragraph or two that should stand out without becoming a full callout.
- Matching GOV.UK / NHS design-system conventions for inset text.
- Emphasising supporting content in articles, guidance pages, or policy documents.

## When not to use it

- Do not use for urgent alerts — use `Alert` or `AlertDialog`.
- Do not use when an accessible label is meaningful — `InsetText` has no `label` prop; use `InformationCallout` if you need an `aria-label`.
- Do not use for form hint text — use `Hint` associated with the field.
- Do not use for inline emphasis inside a sentence — use `Flair`, `Code`, or `Character`.

## How to use it

Import the component and render your inset content via the `children` snippet. Provide CSS (e.g., a left border and padding) on the `.inset-text` class or a consumer class.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `inset-text` class.
- `children` (Snippet, required) — content to display inside the inset text block.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<div>`.

## Usage

### Simple inset notice

```svelte
<script lang="ts">
    import InsetText from "./InsetText.svelte";
</script>

<InsetText>It can take up to 8 weeks to process.</InsetText>
```

### Inset text with structured content

```svelte
<script lang="ts">
    import InsetText from "./InsetText.svelte";
</script>

<InsetText>
    <p>You must apply before the deadline. Late applications will not be accepted.</p>
</InsetText>
```

### Inset text inside an article

```svelte
<script lang="ts">
    import InsetText from "./InsetText.svelte";
</script>

<article>
    <h2>Applying for a permit</h2>
    <p>Start your application online.</p>

    <InsetText>
        <p>Keep your reference number handy — you will need it for all future communications.</p>
    </InsetText>

    <p>Submit supporting documents within 14 days.</p>
</article>
```

### Inset text with consumer styling

```svelte
<script lang="ts">
    import InsetText from "./InsetText.svelte";
</script>

<InsetText class="inset-text-brand">
    <p>This section applies to applicants aged 18 and over.</p>
</InsetText>

<style>
    :global(.inset-text-brand) {
        border-left: 0.25rem solid #005eb8;
        padding: 0.75rem 1rem;
        background: #f9fafb;
    }
</style>
```

### Inset text with data attribute for variant styling

```svelte
<script lang="ts">
    import InsetText from "./InsetText.svelte";
</script>

<InsetText data-variant="important">
    <p>Read all safety instructions before proceeding.</p>
</InsetText>
```

## Accessibility

- `role="note"` identifies the content as supplementary information to assistive technologies.
- No keyboard interaction required — the component is passive.
- Consumers styling with a left border should maintain at least 3:1 contrast against the page background.
- Content inside `InsetText` is announced with appropriate context by screen readers.
- Compliant with WCAG 2.2 AAA when the consumer maintains proper colour contrast.

## Related components

- `InformationCallout` — a labelled `<aside role="note">` for titled supplementary information.
- `WarningCallout` — a callout box highlighting a warning message.
- `Alert` — a status message for important feedback.
- `Hint` — hint text providing guidance for a form field.
- `BodyText` — a standard rendered text block within a content-width container.

---

Lily™ and Lily Design System™ are trademarks.
