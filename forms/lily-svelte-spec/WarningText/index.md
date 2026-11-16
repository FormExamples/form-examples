# WarningText

A short warning shown as an icon and a bold line of text, with a visually hidden prefix supplied by the consumer.

## Canonical documentation

See [components/warning-text/index.md](../../../components/warning-text/index.md) for the full component documentation: behaviour, props and guidance.

## Usage

```svelte
<WarningText>
  {#snippet icon()}!{/snippet}
  <span class="screen-reader-span">Warning</span>
  You can be fined up to £5,000 if you do not register.
</WarningText>
```

## Contract

`<div class="warning-text">`; an optional `icon` snippet inside `<span class="warning-text-icon" aria-hidden="true">`; the children (the consumer's visually hidden prefix, then the text) inside `<strong class="warning-text-text">`; rest props spread. No role, no strings.

---

Lily™ and Lily Design System™ are trademarks.
