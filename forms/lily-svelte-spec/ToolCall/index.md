# ToolCall

A headless wrapper for a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error.

## Canonical documentation

See [components/tool-call/index.md](../../../components/tool-call/index.md) for the full component documentation: ARIA, behaviour, props and guidance.

## Usage

```svelte
<ToolCall>…</ToolCall>
```

## Contract

The root of a tool-call record: a native `<details>` closed by default. Put `ToolCallName` and `ToolCallStatus` in the summary and `ToolCallInput`, `ToolCallOutput` or `ToolCallError` in the body.

---

Lily™ and Lily Design System™ are trademarks.
