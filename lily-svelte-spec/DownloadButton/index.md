# DownloadButton

A download link styled as a button, with optional file size and format metadata. This headless Svelte component renders a native `<a>` element so consumers can right-click and save.

## What it is

A headless Svelte 5 component rendering an `<a>` element with the `download` attribute, file metadata, and a required accessible label. Category: actions / links.

## What it does

- Renders an `<a>` with the base class `download-button` plus consumer `class`.
- **Requires** `href` and `label` props.
- Sets `aria-label` from `label`.
- Adds `data-file-size` and `data-file-format` attributes when provided.
- Forwards the native `download` attribute. `download={true}` produces a bare `download` attribute; a string sets the suggested filename.
- Default visible text falls back to `label`; custom children override.

## When to use it

- Downloadable assets (PDFs, archives, datasets, brochures).
- Buttons where the user expectation is "save this file".

## When not to use it

- For navigation that opens a page, use `ActionLink` or a plain `<a>`.
- For triggering an action handler (no URL), use `Button`.

## Props

- `class` — string, default `""`. CSS class appended to `download-button`.
- `href` — string, **required**. File URL.
- `label` — string, **required**. Accessible label and default text.
- `fileSize` — string, optional. Pre-formatted file size text.
- `fileFormat` — string, optional. File format text.
- `download` — `string | boolean`, optional. Native download attribute.
- `children` — `Snippet`, optional. Custom button content.
- `...restProps` — additional HTML attributes spread onto the `<a>`.

## Usage

```svelte
<script lang="ts">
  import DownloadButton from './DownloadButton.svelte';
</script>

<DownloadButton
  href="/files/brochure.pdf"
  label="Download brochure (PDF, 2.4 MB)"
  fileSize="2.4 MB"
  fileFormat="PDF"
  download
/>
```

## Accessibility

- Implicit link semantics.
- `aria-label` is the entire accessible name and should describe the download intent and file metadata.

## Related components

- `ActionLink` — link styled as an action trigger.
- `Button` — clickable button for action handlers.

## References

- HTML `<a>` `download` attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download
- Mozilla Protocol Design System: https://protocol.mozilla.org
