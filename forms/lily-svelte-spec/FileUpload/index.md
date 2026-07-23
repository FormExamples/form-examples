# FileUpload

A button-triggered file picker for uploading files. Wraps a hidden `<input type="file">` with a visible `<button>` and a polite live region that announces how many files have been selected.

## What it is

`FileUpload` provides a richer alternative to `FileInput`: the picker is triggered by an accessible `<button>`, and an `aria-live="polite"` status region announces the selected file count. Useful when you want to theme the trigger visually while retaining the native file picker.

## What it does

- Renders a `<div>` containing a `<button type="button">`, a hidden `<input type="file">`, and a polite status `<span>`.
- Clicks on the button invoke `inputRef.click()` to open the native picker.
- Tracks selection count via `$state()` and renders "N files selected".
- Calls `onchange` with the resulting `FileList`.

## When to use it

- Forms where upload should be triggered from a styled button.
- Single or multi-file uploads that need immediate status feedback.
- Any case where you want a polite live region announcing selection changes.

## When not to use it

- For drag-and-drop zones. Compose a drop target around `FileInput` or extend this component.
- For image-only with preview. Use `ImageFileInput`.
- For simple native-styled pickers. Use `FileInput`.

## How to use it

Provide an accessible `label` (also used as button text) and a handler.

```svelte
<script lang="ts">
    import FileUpload from "./FileUpload.svelte";
    function handleFiles(files: FileList | null) { /* … */ }
</script>

<FileUpload label="Upload files" accept=".pdf" onchange={handleFiles} />
```

## Props

| Prop       | Type                                    | Default     | Description                                   |
| ---------- | --------------------------------------- | ----------- | --------------------------------------------- |
| `class`    | `string`                                | `""`        | CSS class appended to the base class.        |
| `label`    | `string`                                | required    | Accessible name and button text.              |
| `accept`   | `string`                                | `undefined` | Accepted file types.                          |
| `multiple` | `boolean`                               | `false`     | Allow selecting multiple files.               |
| `disabled` | `boolean`                               | `false`     | Whether the button is disabled.               |
| `onchange` | `(files: FileList \| null) => void`     | `undefined` | Callback when files are selected.             |
| `...rest`  | `unknown`                               | —           | Additional HTML attributes on the wrapper.    |

## Usage

### 1. Basic upload

```svelte
<FileUpload label="Upload files" accept=".pdf" onchange={handleFiles} />
```

### 2. Multiple images

```svelte
<FileUpload
    label="Upload images"
    accept="image/*"
    multiple
    onchange={handleImages}
/>
```

### 3. Disabled state

```svelte
<FileUpload label="Upload" disabled />
```

### 4. Inside a Field

```svelte
<Field label="Supporting documents">
    <FileUpload
        label="Attach files"
        accept=".pdf,.doc,.docx"
        multiple
        onchange={handleFiles}
    />
</Field>
```

### 5. Handling files in the callback

```svelte
<script lang="ts">
    import FileUpload from "./FileUpload.svelte";
    async function handleFiles(files: FileList | null) {
        if (!files) return;
        for (const file of files) await upload(file);
    }
</script>

<FileUpload label="Upload" multiple onchange={handleFiles} />
```

## Accessibility

- `aria-label` on the trigger button.
- `aria-live="polite"` status announces file-count changes.
- `data-file-count` attribute is exposed for CSS or testing.
- The status text ("file" / "files selected") is currently hard-coded in English; if you need full localisation, wrap the component or provide your own live region.

## Related components

- `FileInput` — minimal native file input.
- `ImageFileInput` — image-only file input with preview.
- `FileManager`, `FileDialog` — higher-level file management surfaces.

---

Lily™ and Lily Design System™ are trademarks.
