# Image

An image component that displays visual content with required alt text and optional caption. When `caption` is provided, it renders a `<figure>` containing the `<img>` and a `<figcaption>`; without a caption it renders a plain `<img>`. Supports native lazy loading.

## What it is

A Svelte 5 component that conditionally wraps an `<img>` in a `<figure>` + `<figcaption>` when `caption` is provided. The root element's class is `image` in both cases.

## What it does

- When `caption` is provided, renders:
  ```
  <figure class="image ...">
    <img src={src} alt={alt} loading={loading} />
    <figcaption>{caption}</figcaption>
  </figure>
  ```
  and spreads `restProps` onto the `<figure>`.
- When `caption` is not provided, renders `<img class="image ..." src={src} alt={alt} loading={loading}>` and spreads `restProps` onto the `<img>`.
- `alt` is always required to enforce accessibility.

## When to use it

- Any visible image in page content, with required alt text.
- Images with an attribution or description that belongs inside a `<figure>`.
- Lazy-loaded images below the fold.

## When not to use it

- For a graphical form submit button. Use `ImageInput`.
- For user-uploaded image files. Use `ImageFileInput` or `FileUpload`.
- For decorative background graphics. Use CSS background images instead.
- For responsive media with multiple sources. Use a raw `<picture>` element.
- For QR codes. Use `QrCodeImage`.

## How to use it

Pass `src` and `alt`. Optionally pass `caption` to get the figure/figcaption wrapping, and `loading="lazy"` to defer loading.

## Props

- `class` (string, optional) - CSS class appended after the base `image` class.
- `src` (string, required) - Image source URL.
- `alt` (string, required) - Alternative text for screen readers.
- `caption` (string, optional) - If provided, wraps the image in a `<figure>` with a `<figcaption>`.
- `loading` (`"lazy" | "eager"`, optional) - Native browser loading mode.
- `...restProps` - Additional HTML attributes spread onto the root element (`<img>` without caption, `<figure>` with caption).

## Usage

```svelte
<script lang="ts">
    import Image from "./Image.svelte";
</script>

<Image src="/photo.jpg" alt="A sunset over the ocean" />
```

```svelte
<script lang="ts">
    import Image from "./Image.svelte";
</script>

<Image
    src="/photo.jpg"
    alt="A sunset over the ocean"
    caption="Photo by Jane Doe"
/>
```

```svelte
<script lang="ts">
    import Image from "./Image.svelte";
</script>

<Image src="/large-photo.jpg" alt="Landscape" loading="lazy" />
```

```svelte
<script lang="ts">
    import Image from "./Image.svelte";
    const photos = [
        { src: "/a.jpg", alt: "Photo A", caption: "First photo" },
        { src: "/b.jpg", alt: "Photo B", caption: "Second photo" },
    ];
</script>

{#each photos as p}
    <Image src={p.src} alt={p.alt} caption={p.caption} loading="lazy" />
{/each}
```

```svelte
<script lang="ts">
    import Image from "./Image.svelte";
</script>

<Image
    src="/banner.jpg"
    alt="Site banner"
    class="hero-image"
    data-testid="hero"
    width="1200"
    height="400"
/>
```

## Accessibility

- `alt` is required; never use an empty string unless the image is purely decorative (in which case prefer CSS backgrounds or a decorative `Icon`).
- `<figure>` + `<figcaption>` semantically associate the caption with the image.
- Lazy loading does not affect accessibility - the alt text is still available.

## Related components

- `ImageInput` - graphical `<input type="image">` submit button.
- `ImageFileInput` - file input restricted to image files.
- `QrCodeImage` - QR code image generator.
- `Figure` - standalone figure/figcaption wrapper.
- `FeaturePhoto` - responsive photo component with alt-text validation.
