# FileManager

A headless region wrapper for a file browser or file management surface. Renders a `<div role="region">` with an accessible label; the consumer supplies all listing and navigation UI.

## What it is

`FileManager` is a structural landmark for file management features. It defines a named `region` landmark so assistive technology can navigate directly to the file browser, and it leaves folder structure, file listings, breadcrumbs, and actions entirely to the consumer.

## What it does

- Renders `<div class="file-manager" role="region" aria-label={label}>`.
- Forwards `restProps` onto the `<div>`.

## When to use it

- Embedded file browsers inside content management systems, cloud storage apps, admin dashboards.
- Document library pages.
- Any page-level file browsing experience that should be identifiable as a landmark.

## When not to use it

- For modal file operations. Use `FileDialog`.
- For single file selection from the OS. Use `FileInput` or `FileUpload`.
- For small inline lists without landmark semantics. Use a plain `<ul>`.

## How to use it

Wrap your file listing and actions inside `FileManager`.

```svelte
<script lang="ts">
    import FileManager from "./FileManager.svelte";
</script>

<FileManager label="Project files">
    <ul>
        <li>document.pdf</li>
        <li>image.png</li>
    </ul>
</FileManager>
```

## Props

| Prop       | Type       | Default  | Description                              |
| ---------- | ---------- | -------- | ---------------------------------------- |
| `class`    | `string`   | `""`     | CSS class appended to the base class.   |
| `label`    | `string`   | required | Accessible name via `aria-label`.        |
| `children` | `Snippet`  | required | File browser content.                    |
| `...rest`  | `unknown`  | —        | Additional HTML attributes on the `<div>`. |

## Usage

### 1. Basic file listing

```svelte
<FileManager label="Project files">
    <ul>
        <li>document.pdf</li>
        <li>image.png</li>
        <li>data.csv</li>
    </ul>
</FileManager>
```

### 2. With breadcrumbs

```svelte
<FileManager label="Documents">
    <BreadcrumbNav label="Path">
        <BreadcrumbList>
            <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
            <BreadcrumbListItem current>Documents</BreadcrumbListItem>
        </BreadcrumbList>
    </BreadcrumbNav>
    <ul>…</ul>
</FileManager>
```

### 3. With actions

```svelte
<FileManager label="Assets">
    <button type="button" onclick={upload}>Upload</button>
    <button type="button" onclick={refresh}>Refresh</button>
    <ul>…</ul>
</FileManager>
```

### 4. Driven by data

```svelte
<FileManager label="My files">
    <ul>
        {#each files as f}
            <li>
                <button type="button" onclick={() => open(f)}>{f.name}</button>
            </li>
        {/each}
    </ul>
</FileManager>
```

### 5. Alongside a FileDialog

```svelte
<FileManager label="Project files">
    <button type="button" onclick={() => open = true}>New file…</button>
</FileManager>
<FileDialog label="New file" bind:open>…</FileDialog>
```

## Accessibility

- `role="region"` defines a named landmark.
- `aria-label` provides the accessible name.
- Consumers own keyboard navigation (arrow keys, Enter to open, context menus, etc.).

## Related components

- `FileDialog` — modal file operation dialog.
- `FileInput`, `FileUpload`, `ImageFileInput` — file pickers.
- `BreadcrumbNav` — path navigation.
- `DataTable` — tabular file listings.

---

Lily™ and Lily Design System™ are trademarks.
