<script lang="ts">
    // FileUpload component
    //
    // A button-triggered file picker for uploading files. Combines a hidden
    // <input type="file"> with a visible button and a live status region that
    // announces how many files have been selected. Useful for document uploads,
    // image uploads, and any form that accepts file attachments.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the upload button; also displayed as button text.
    //   accept — string, default undefined. Accepted file types (e.g., ".pdf", "image/*").
    //   multiple — boolean, default false. Whether to allow selecting multiple files.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   onchange — (files: FileList | null) => void, default undefined. Callback when files are selected.
    //   selectedLabel — (count: number) => string, optional. The status for a count of files, in the consumer's words;
    //     plural forms are the consumer's. Without it the status stays empty: no English default.
    //   ...restProps — additional HTML attributes spread onto the outer <div>.
    //
    // Syntax:
    //   <FileUpload label="Upload files" accept=".pdf" onchange={handleFiles} />
    //
    // Examples:
    //   <!-- Basic file upload -->
    //   <FileUpload label="Upload files" accept=".pdf" onchange={handleFiles} />
    //
    //   <!-- Multiple image upload -->
    //   <FileUpload label="Upload images" accept="image/*" multiple onchange={handleImages} />
    //
    // Keyboard:
    //   - Tab: focus the upload button
    //   - Enter/Space: activate the file picker dialog (native button behavior)
    //
    // Accessibility:
    //   - aria-label on the button provides the accessible name
    //   - aria-live="polite" on the status span announces file count changes
    //   - data-file-count attribute for consumer CSS or testing
    //   - Hidden file input is triggered via button click
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //   - Status text "file"/"files" is hardcoded; override via consumer if needed
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses type="button" on trigger to prevent form submission
    //   - Tracks file count via $state() for the live status region
    //
    // References:
    //   - MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file

    let {
        class: className = "",
        label,
        accept = undefined,
        multiple = false,
        disabled = false,
        onchange = undefined,
        selectedLabel = undefined,
        dropZone = false,
        ...restProps
    }: {
        /** Accessible label for the button. */
        label: string;
        /** Accepted file types. */
        accept?: string;
        /** Allow multiple files. */
        multiple?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        /** Callback with selected files. */
        onchange?: (files: FileList | null) => void;
        /** The status for a count of files; plural forms are the consumer's. */
        selectedLabel?: (count: number) => string;
        /**
         * The root also accepts dropped files, into the same onchange and count, with data-drag-over while a file is held
         * over it. Dragging is never the only way: the button still chooses files, and the drop zone adds no tab stop.
         */
        dropZone?: boolean;
        [key: string]: unknown;
    } = $props();

    let inputRef: HTMLInputElement | undefined = $state(undefined);
    let fileCount = $state(0);

    function handleClick() {
        inputRef?.click();
    }

    let dragOver = $state(false);

    /** The files a drop carries: all of them with `multiple`, else the first. */
    function dropped(files: FileList): FileList {
        if (multiple || files.length <= 1 || typeof DataTransfer === "undefined") return files;
        const one = new DataTransfer();
        one.items.add(files[0]);
        return one.files;
    }

    function handleDragOver(event: DragEvent) {
        if (!dropZone || disabled || !event.dataTransfer?.types.includes("Files")) return;
        event.preventDefault();
        dragOver = true;
    }

    function handleDrop(event: DragEvent) {
        if (!dropZone || disabled) return;
        event.preventDefault();
        dragOver = false;
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return;
        const chosen = dropped(files);
        fileCount = chosen.length;
        onchange?.(chosen);
    }

    function handleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        fileCount = input.files?.length ?? 0;
        onchange?.(input.files);
    }
</script>

<!-- FileUpload.svelte -->
<div
    class={`file-upload ${className}`}
    data-drop-zone={dropZone ? "" : undefined}
    data-drag-over={dragOver ? "" : undefined}
    ondragover={handleDragOver}
    ondragleave={() => (dragOver = false)}
    ondrop={handleDrop}
    {...restProps}
>
    <button
        type="button"
        aria-label={label}
        {disabled}
        onclick={handleClick}
    >
        {label}
    </button>
    <input
        bind:this={inputRef}
        type="file"
        {accept}
        {multiple}
        hidden
        onchange={handleChange}
    />
    <span
        aria-live="polite"
        data-file-count={fileCount}
    >
        {#if fileCount > 0 && selectedLabel}
            {selectedLabel(fileCount)}
        {/if}
    </span>
</div>
