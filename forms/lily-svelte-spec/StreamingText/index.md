# StreamingText

A headless wrapper for text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete.

## Canonical documentation

See [components/streaming-text/index.md](../../../components/streaming-text/index.md) for the full component documentation: ARIA, behaviour, props and guidance.

## Usage

```svelte
<script lang="ts">
  import StreamingText from "./StreamingText.svelte";
</script>

<StreamingText
  label="Assistant answer"
  streaming={isStreaming}
>
  {answerSoFar}
</StreamingText>
```

## Contract

A `<div role="status" aria-live="polite" aria-atomic="true">`; `streaming` adds `aria-busy="true"` and `data-streaming="true"` and is absent otherwise; `label` sets `aria-label`; no timing, splitting or animation.

---

Lily™ and Lily Design System™ are trademarks.
