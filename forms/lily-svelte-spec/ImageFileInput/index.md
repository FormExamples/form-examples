# ImageFileInput

A file input pre-configured to accept image files. Wraps a native `<input type="file">` with `accept="image/*"` by default and an accessible label.

## What it is

A Svelte 5 thin wrapper around `<input type="file">` with `accept="image/*"` as the default MIME filter. Provides `aria-label` via the required `label` prop.

## What it does

- Renders `<input class="image-file-input ..." type="file" aria-label={label} accept={accept}>`.
- Passes through `required` and `disabled`.
- Spreads additional HTML attributes onto the `<input>`.

## When to use it

- Forms that need the user to select an image file (profile photo, avatar upload, document scan).
- When a native file picker restricted to images is appropriate.

## When not to use it

- For drag-and-drop file upload surfaces. Use `FileUpload`.
- For a general file input accepting any type. Use `FileInput`.
- For a dialog-style file browser. Use `FileDialog`.
- For a graphical submit button using an image. Use `ImageInput`.

## How to use it

Pass a localized `label`. Optionally narrow `accept` to specific image MIME types, and set `required`/`disabled` as needed. The component has no preview UI - consumers should render a preview from the selected file if desired.

## Props

- `class` (string, optional) - CSS class appended after the base `image-file-input` class.
- `label` (string, required) - Accessible name via `aria-label`.
- `accept` (string, default `"image/*"`) - MIME filter for the file picker.
- `required` (boolean, default `false`) - Whether the input is required.
- `disabled` (boolean, default `false`) - Whether the input is disabled.
- `...restProps` - Additional HTML attributes spread onto the `<input>` (including `onchange`).

## Usage

```svelte
<script lang="ts">
    import ImageFileInput from "./ImageFileInput.svelte";
</script>

<ImageFileInput label="Upload profile photo" />
```

```svelte
<script lang="ts">
    import ImageFileInput from "./ImageFileInput.svelte";
</script>

<ImageFileInput
    label="Upload document scan"
    accept="image/png, image/jpeg"
    required
/>
```

```svelte
<script lang="ts">
    import ImageFileInput from "./ImageFileInput.svelte";
    let previewUrl = $state<string | null>(null);

    function onChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        previewUrl = file ? URL.createObjectURL(file) : null;
    }
</script>

<label for="avatar">Avatar</label>
<ImageFileInput
    id="avatar"
    label="Avatar image"
    onchange={onChange}
/>
{#if previewUrl}
    <img src={previewUrl} alt="Preview" />
{/if}
```

```svelte
<script lang="ts">
    import ImageFileInput from "./ImageFileInput.svelte";
    import Field from "../Field/Field.svelte";
    import Hint from "../Hint/Hint.svelte";
</script>

<Field label="Photo">
    <Hint id="photo-hint">PNG or JPEG, up to 2 MB</Hint>
    <ImageFileInput
        label="Photo"
        aria-describedby="photo-hint"
        accept="image/png, image/jpeg"
    />
</Field>
```

```svelte
<script lang="ts">
    import ImageFileInput from "./ImageFileInput.svelte";
</script>

<ImageFileInput
    label="Gallery upload"
    accept="image/*"
    multiple
    class="gallery-upload"
    data-testid="gallery-upload"
/>
```

## Accessibility

- `aria-label` provides the accessible name.
- The native `<input type="file">` includes built-in keyboard support (Tab focus, Enter/Space to open dialog).
- `required` and `disabled` are reflected on the input.
- Consumers should provide visible label text alongside the control for sighted users.

## Related components

- `FileInput` - generic file input.
- `FileUpload` - drag-and-drop upload area.
- `FileDialog` - file browser dialog.
- `ImageInput` - `<input type="image">` graphical submit.
- `Image` - display an image.

---

Lily™ and Lily Design System™ are trademarks.
