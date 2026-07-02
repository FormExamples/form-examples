# QrCodeImage

A headless container for a QR code (two-dimensional barcode-image). Renders a `<div role="img">` with an `aria-label` describing the encoded content; the consumer provides the actual visual rendering (SVG, canvas, or third-party library output) as children.

## What it is

- Component: `QrCodeImage`
- HTML element: `<div>`
- Role: `img`
- Category: image container

## What it does

- Renders a `<div role="img">` so assistive technology treats the rendering as an image.
- Applies `aria-label` as the accessible description of what the QR code encodes.
- Renders the consumer-supplied children (SVG, canvas, img) as the visible output.
- Forwards any additional attributes onto the wrapping `<div>`.

## When to use it

- Sharing URLs for mobile scanning.
- WiFi credentials, Wi-Fi join, or event check-ins.
- Payment and point-of-sale flows.
- Authentication secret / TOTP enrollment.

## When not to use it

- For a plain `<img>` of a QR code — use a native `<img>` with `alt` text instead.
- For short URLs that can be copied — use `ClipboardCopyButton`.
- For decorative icons unrelated to scanning — use `Icon` or `Image`.

## How to use it

Import and provide the QR payload visualization as children. The `label` should describe *what happens on scan*, not "QR code".

```svelte
import QrCodeImage from './QrCodeImage.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `qr-code-image`.
- `label`: string, required. Accessible description of the encoded content via `aria-label`.
- `children`: Snippet, required. Visual rendering of the code (SVG, canvas, `<img>`, etc.).
- `...restProps`: spread onto the `<div>`.

## Usage

### With an SVG rendering

```svelte
<script lang="ts">
  import QrCodeImage from './QrCodeImage.svelte';
</script>

<QrCodeImage label="Scan to visit example.com">
  <svg viewBox="0 0 29 29" width="160" height="160" aria-hidden="true">
    <!-- QR code paths supplied by a library -->
  </svg>
</QrCodeImage>
```

### With a canvas rendering

```svelte
<script lang="ts">
  import QrCodeImage from './QrCodeImage.svelte';

  let qrCanvas = $state<HTMLCanvasElement | null>(null);
  // populate qrCanvas via your QR library of choice
</script>

<QrCodeImage label="Scan to download the app">
  <canvas bind:this={qrCanvas}></canvas>
</QrCodeImage>
```

### With an image source

```svelte
<script lang="ts">
  import QrCodeImage from './QrCodeImage.svelte';
</script>

<QrCodeImage label="Scan to open the menu">
  <img src="/qr/menu.png" alt="" aria-hidden="true" />
</QrCodeImage>
```

### WiFi join payload

```svelte
<script lang="ts">
  import QrCodeImage from './QrCodeImage.svelte';
</script>

<QrCodeImage label="Scan to join Wi-Fi network 'Guest'">
  <svg viewBox="0 0 29 29" aria-hidden="true">
    <!-- QR paths for WIFI:T:WPA;S:Guest;P:...;; -->
  </svg>
</QrCodeImage>
```

### Localized label

```svelte
<QrCodeImage label="Escanear para visitar example.com">
  <svg viewBox="0 0 29 29" aria-hidden="true"></svg>
</QrCodeImage>
```

## Accessibility

- `role="img"` + `aria-label` makes the container announce a single descriptive name, even when the inner SVG/canvas has many nested paths.
- Keep the inner visual as `aria-hidden="true"` (or `alt=""` on an `<img>`) so only the outer label is announced.
- Provide a fallback text link near the QR code — screen-reader users and keyboard users cannot scan.

## Related components

- `Image`, `Icon` — simple image and icon containers.
- `ClipboardCopyButton` — copy-to-clipboard alternative for URLs.
