# Picture

A headless wrapper around the native picture element: the browser chooses among its source children and falls back to the img child.

## Canonical documentation

See [components/picture/index.md](../../../components/picture/index.md) for the full component documentation: behaviour, props and guidance.

## Usage

```svelte
<Picture>
  <source
    srcset="wide.webp"
    media="(min-width: 800px)"
    type="image/webp"
  />
  <img
    src="small.jpg"
    alt="A lily in bloom"
    width="320"
    height="200"
  />
</Picture>
```

## Contract

The native `<picture class="picture">`; sources and img as children, rest props only; no ARIA, state or strings. The img's `alt` is the consumer's.

---

Lily™ and Lily Design System™ are trademarks.
