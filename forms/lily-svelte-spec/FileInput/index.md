# FileInput

A headless file input that wraps a native `<input type="file">` with accessible labelling, optional accepted file types, and multiple-selection support.

## What it is

`FileInput` is a thin wrapper around `<input type="file">`. It contributes `aria-label`, and forwards `accept`, `multiple`, `required`, and `disabled`. The file selection itself is managed by the browser; for security reasons there is no bindable value.

## What it does

- Renders `<input type="file" aria-label={label}>`.
- Forwards `accept`, `multiple`, `required`, `disabled`.
- Spreads `restProps` onto the `<input>`.

## When to use it

- Basic file selection in any form.
- Image uploads, document attachments, profile pictures.
- When you want the browser's native file picker UI.

## When not to use it

- For drag-and-drop upload zones with progress. Use `FileUpload`.
- For image-only uploads with a preview. Use `ImageFileInput`.
- For file browsing inside the app. Use `FileManager` or `FileDialog`.

## How to use it

Provide a required `label` and optional `accept`.

```svelte
<script lang="ts">
    import FileInput from "./FileInput.svelte";
</script>

<FileInput label="Upload photo" accept="image/*" />
```

## Props

| Prop       | Type      | Default     | Description                                    |
| ---------- | --------- | ----------- | ---------------------------------------------- |
| `class`    | `string`  | `""`        | CSS class appended to the base class.         |
| `label`    | `string`  | required    | Accessible name via `aria-label`.              |
| `accept`   | `string`  | `undefined` | Comma-separated MIME types or extensions.      |
| `multiple` | `boolean` | `false`     | Allow selecting multiple files.                |
| `required` | `boolean` | `false`     | Whether the input is required.                 |
| `disabled` | `boolean` | `false`     | Whether the input is disabled.                 |
| `...rest`  | `unknown` | —           | Additional HTML attributes on the `<input>`.   |

## Usage

### 1. Image upload

```svelte
<FileInput label="Upload photo" accept="image/*" />
```

### 2. Multiple documents

```svelte
<FileInput label="Attach documents" accept=".pdf,.doc,.docx" multiple />
```

### 3. Required profile picture

```svelte
<FileInput label="Profile picture" accept="image/png,image/jpeg" required />
```

### 4. With onchange handler

```svelte
<FileInput label="Upload CSV" accept=".csv" onchange={handleFiles} />
```

### 5. Inside a Field

```svelte
<Field label="Avatar" description="PNG or JPEG, up to 5 MB">
    <FileInput label="Avatar" accept="image/png,image/jpeg" />
</Field>
```

## Accessibility

- `aria-label` provides the accessible name since there is no visible label.
- Native `<input type="file">` provides keyboard support (Enter/Space opens the picker).
- Consumers should convey file name, size, and type feedback separately (e.g. via `FileUpload`'s live region).

## Related components

- `FileUpload` — button-triggered uploader with a live file-count announcement.
- `ImageFileInput` — image file input with preview.
- `FileManager` — embedded file browser region.
- `FileDialog` — modal file operation dialog.
