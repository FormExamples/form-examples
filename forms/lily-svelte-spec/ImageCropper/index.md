# ImageCropper

A headless container for cropping and resizing an image to a selected region. Declares a `role="application"` region with an accessible label and relies on the consumer to provide the actual image and crop overlay surface (image + overlay, canvas, SVG handles, or a third-party cropping library).

## What it is

A Svelte 5 headless component that renders `<div class="image-cropper ...">` with `role="application"` and `aria-label`. The `children` snippet is where the consumer plugs in an `<img>`, `<canvas>`, `<svg>`, or any cropping implementation.

## What it does

- Declares an `application` landmark so assistive tech knows complex pointer interactions occur inside.
- Applies the accessible name via `aria-label`.
- Forwards `...restProps` onto the `<div>`.
- Contains no cropping logic, no pointer handlers, and no styles.

## When to use it

- Avatar and profile-photo editors that frame an image to a fixed region.
- Media upload workflows that need a drag-to-frame crop before saving.
- Document scanning and content management where a region of an image must be isolated.

## When not to use it

- Simply selecting and previewing a file - use `ImageFileInput`.
- Capturing a handwritten signature - use `SignaturePad`.
- Displaying an image without editing - use `Image`.
- Any place where `role="application"` is not actually needed - it suppresses screen-reader browse mode and should only be used for genuine custom input widgets.

## How to use it

1. Import the component.
2. Provide a translated `label` (for example, `"Crop your profile photo"`).
3. Place an image and crop overlay inside `children`.
4. Implement all pointer/touch/stylus handling on that surface.

## Props

- `class` (string, optional, default `""`) - merged with the base `image-cropper` class.
- `label` (string, required) - accessible description via `aria-label`.
- `children` (Snippet, required) - the image and crop overlay surface.
- `...restProps` - spread onto the `<div>`.

## Usage

Image with a crop overlay:

```svelte
<script lang="ts">
    import ImageCropper from "./ImageCropper.svelte";
</script>

<ImageCropper label="Crop your profile photo">
    <img src="/uploads/photo.jpg" alt="Photo to crop" />
</ImageCropper>
```

Canvas surface:

```svelte
<script lang="ts">
    import ImageCropper from "./ImageCropper.svelte";
</script>

<ImageCropper label="Adjust the crop region around the document">
    <canvas width="600" height="800"></canvas>
</ImageCropper>
```

In an avatar upload flow:

```svelte
<script lang="ts">
    import ImageCropper from "./ImageCropper.svelte";
    let previewUrl = $state("");
</script>

<ImageCropper label="Crop your profile photo to a square">
    <img src={previewUrl} alt="Selected photo to crop" />
</ImageCropper>
```

With custom class:

```svelte
<script lang="ts">
    import ImageCropper from "./ImageCropper.svelte";
</script>

<ImageCropper label="Image cropper" class="boxed">
    <img src="/uploads/photo.jpg" alt="Photo to crop" />
</ImageCropper>
```

Paired with a reset button:

```svelte
<script lang="ts">
    import ImageCropper from "./ImageCropper.svelte";
    function reset() { /* consumer resets the crop region */ }
</script>

<ImageCropper label="Crop your profile photo">
    <img src="/uploads/photo.jpg" alt="Photo to crop" />
</ImageCropper>
<button onclick={reset}>Reset</button>
```

## Accessibility

- `role="application"` intentionally shifts screen readers out of browse mode for custom widgets. Use it only when genuinely needed.
- `aria-label` must be descriptive and localized.
- Consumers should offer keyboard-accessible controls for moving and resizing the crop region.

References:
- WAI-ARIA `application` role: https://www.w3.org/TR/wai-aria-1.2/#application

## Related components

- `ImageFileInput` - select and preview an image file.
- `Image` - display an image without editing.
- `SignaturePad` - capture a handwritten signature.

---

Lily™ and Lily Design System™ are trademarks.
