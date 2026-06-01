# SignaturePad

A headless container for capturing handwritten signatures. Declares a `role="application"` region with an accessible label and relies on the consumer to provide the actual drawing surface (canvas, SVG, or third-party library).

## What it is

A Svelte 5 headless component that renders `<div class="signature-pad ...">` with `role="application"` and `aria-label`. The `children` snippet is where the consumer plugs in a `<canvas>`, `<svg>`, or any drawing implementation.

## What it does

- Declares an `application` landmark so assistive tech knows complex pointer interactions occur inside.
- Applies the accessible name via `aria-label`.
- Forwards `...restProps` onto the `<div>`.
- Contains no drawing logic, no pointer handlers, and no styles.

## When to use it

- Contract and consent workflows that collect a handwritten signature.
- Delivery confirmations and in-person authorizations.
- Legal or clinical documents that demand a signature rather than a checkbox.

## When not to use it

- Simple consent checkboxes - use `CheckboxInput`.
- Typed-name signatures - use `TextInput`.
- Image uploads of a pre-existing signature - use `ImageFileInput`.
- Any place where `role="application"` is not actually needed - it suppresses screen-reader browse mode and should only be used for genuine custom input widgets.

## How to use it

1. Import the component.
2. Provide a translated `label` (for example, `"Sign to accept terms"`).
3. Place a drawing surface inside `children`.
4. Implement all pointer/touch/stylus handling on that surface.

## Props

- `class` (string, optional, default `""`) - merged with the base `signature-pad` class.
- `label` (string, required) - accessible description via `aria-label`.
- `children` (Snippet, required) - the drawing surface.
- `...restProps` - spread onto the `<div>`.

## Usage

Canvas drawing surface:

```svelte
<script lang="ts">
    import SignaturePad from "./SignaturePad.svelte";
</script>

<SignaturePad label="Sign here">
    <canvas width="400" height="200"></canvas>
</SignaturePad>
```

SVG surface:

```svelte
<script lang="ts">
    import SignaturePad from "./SignaturePad.svelte";
    let path = $state("");
</script>

<SignaturePad label="Your signature">
    <svg viewBox="0 0 400 200"><path d={path} stroke="black" fill="none" /></svg>
</SignaturePad>
```

With consent text context:

```svelte
<script lang="ts">
    import SignaturePad from "./SignaturePad.svelte";
</script>

<p>I agree to the terms above.</p>
<SignaturePad label="Sign to accept terms">
    <canvas width="500" height="150"></canvas>
</SignaturePad>
```

With custom class:

```svelte
<script lang="ts">
    import SignaturePad from "./SignaturePad.svelte";
</script>

<SignaturePad label="Signature" class="boxed">
    <canvas width="400" height="200"></canvas>
</SignaturePad>
```

Paired with a clear button:

```svelte
<script lang="ts">
    import SignaturePad from "./SignaturePad.svelte";
    let canvas = $state<HTMLCanvasElement>();
    function clear() {
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
</script>

<SignaturePad label="Signature">
    <canvas bind:this={canvas} width="400" height="200"></canvas>
</SignaturePad>
<button onclick={clear}>Clear</button>
```

## Accessibility

- `role="application"` intentionally shifts screen readers out of browse mode for custom widgets. Use it only when genuinely needed.
- `aria-label` must be descriptive and localized.
- Consumers should offer a fallback (for example, typing a name) for users who cannot draw.

References:
- WAI-ARIA `application` role: https://www.w3.org/TR/wai-aria-1.2/#application

## Related components

- `CheckboxInput` - consent checkbox alternative.
- `TextInput` - typed-name signature alternative.
- `ImageFileInput` - upload a signature image.
