# FileDialog

A modal dialog scoped to file operations (open, save, pick). Uses the native `<dialog>` element, renders only when `open` is `true`, and closes on Escape.

## What it is

`FileDialog` is a specialised variant of `Dialog` for file-related workflows. It renders a native `<dialog>` with `aria-label` and an Escape key listener; the consumer populates the dialog with file listings, action buttons, breadcrumbs, or any UI the task requires.

## What it does

- Conditionally renders `<dialog open aria-label={label}>` when `open` is `true`.
- Listens for Escape and sets `open = false`.
- Exposes `tabindex="-1"` for programmatic focus management.
- Binds `open` via `$bindable()`.

## When to use it

- "Open file" / "Save as" / "Choose location" modals in file managers and editors.
- Document pickers, asset browsers, or export dialogs.
- Wherever a dedicated file-scoped modal is clearer than a generic `Dialog`.

## When not to use it

- For a simple OS file picker. Use `FileInput` or `FileUpload`.
- For generic confirmations or forms. Use `Dialog` or `AlertDialog`.
- For a full file browser surface that stays embedded on the page. Use `FileManager`.

## How to use it

Bind `open` and provide dialog content as children.

```svelte
<script lang="ts">
    import FileDialog from "./FileDialog.svelte";
    let open = $state(false);
</script>

<button type="button" onclick={() => open = true}>Open…</button>
<FileDialog label="Open file" bind:open>
    <ul>
        <li>document.txt</li>
        <li>image.png</li>
    </ul>
    <button type="button" onclick={() => open = false}>Cancel</button>
</FileDialog>
```

## Props

| Prop       | Type       | Default | Description                                   |
| ---------- | ---------- | ------- | --------------------------------------------- |
| `class`    | `string`   | `""`    | CSS class appended to the base class.        |
| `label`    | `string`   | required| Accessible name via `aria-label`.             |
| `open`     | `boolean`  | `false` | Whether the dialog is visible. Bindable.      |
| `children` | `Snippet`  | required| Dialog content.                               |
| `...rest`  | `unknown`  | —       | Additional HTML attributes on the `<dialog>`. |

## Usage

### 1. Open file

```svelte
<FileDialog label="Open file" bind:open>
    <ul>
        {#each files as f}<li>{f.name}</li>{/each}
    </ul>
    <button type="button" onclick={() => open = false}>Cancel</button>
</FileDialog>
```

### 2. Save as

```svelte
<FileDialog label="Save as" bind:open>
    <Field label="Filename">
        <TextInput label="Filename" bind:value={filename} />
    </Field>
    <button type="button" onclick={save}>Save</button>
</FileDialog>
```

### 3. Escape closes

```svelte
<FileDialog label="Choose folder" bind:open>
    <p>Press Escape to cancel.</p>
</FileDialog>
```

### 4. With selection callback

```svelte
<FileDialog label="Select image" bind:open>
    {#each images as img}
        <button type="button" onclick={() => { pick(img); open = false; }}>{img.name}</button>
    {/each}
</FileDialog>
```

### 5. Controlled from a menu

```svelte
<DropdownMenu label="File">
    <li role="menuitem" tabindex="-1" onclick={() => open = true}>Open…</li>
</DropdownMenu>
<FileDialog label="Open" bind:open>…</FileDialog>
```

## Accessibility

- Implicit `role="dialog"` from the `<dialog>` element.
- `aria-label` names the dialog.
- Escape closes the dialog; consumers should additionally manage focus trapping and focus return.

## Related components

- `Dialog` — generic modal dialog.
- `AlertDialog` — urgent must-acknowledge dialog.
- `FileInput`, `FileUpload` — native file pickers.
- `FileManager` — embedded file browser region.
