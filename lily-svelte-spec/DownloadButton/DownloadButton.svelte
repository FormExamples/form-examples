<script lang="ts">
    // DownloadButton component
    //
    // A download link styled as a button, with optional file size and format
    // metadata. Renders a native <a> element so consumers can right-click and
    // save. Both `href` and `label` are required: the label provides the
    // accessible name and a default visible text fallback.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   href — string, REQUIRED. File URL.
    //   label — string, REQUIRED. Accessible label and default text.
    //   fileSize — string, optional. Pre-formatted file size text e.g. "2.4 MB".
    //   fileFormat — string, optional. File format text e.g. "PDF".
    //   download — string | boolean, optional. Native download attribute.
    //   children — Snippet, optional. Custom button content.
    //   ...restProps — additional HTML attributes spread onto the <a>.
    //
    // Syntax:
    //   <DownloadButton href="/file.pdf" label="Download brochure" fileSize="2.4 MB" fileFormat="PDF" download />
    //
    // Accessibility:
    //   - Implicit link semantics
    //   - aria-label provides descriptive name including download intent
    //
    // Internationalization:
    //   - Label and content come through props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - href and label are REQUIRED — TypeScript reflects this
    //
    // References:
    //   - HTML download attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        href,
        label,
        fileSize = undefined,
        fileFormat = undefined,
        download = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Consumer CSS class appended to base class */
        class?: string;
        /** File URL (REQUIRED) */
        href: string;
        /** Accessible label and default visible text (REQUIRED) */
        label: string;
        /** Pre-formatted file size text */
        fileSize?: string;
        /** File format text */
        fileFormat?: string;
        /** Native download attribute */
        download?: string | boolean;
        /** Custom button content (defaults to label) */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DownloadButton.svelte -->
<a
    class={`download-button ${className}`}
    {href}
    aria-label={label}
    data-file-size={fileSize}
    data-file-format={fileFormat}
    download={download === true ? "" : download}
    {...restProps}
>
    {#if children}{@render children?.()}{:else}{label}{/if}
</a>
