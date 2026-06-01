<script lang="ts">
    // ClipboardCopyButton component
    //
    // A headless button that copies specified text to the system clipboard
    // using the Clipboard API. It tracks a `copied` state that automatically
    // resets after 2 seconds and exposes it via a `data-copied` attribute for
    // CSS-based feedback. Commonly used for copy-to-clipboard buttons on code
    // snippets, URLs, or shareable content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   text — string, required. The text to copy to the clipboard.
    //   label — string, required. Accessible label for the copy button via aria-label.
    //   onsuccess — () => void, default undefined. Callback invoked after a successful copy.
    //   onerror — (error: unknown) => void, default undefined. Callback invoked if the copy fails.
    //   children — Snippet, default undefined. Optional custom button content.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <ClipboardCopyButton text="https://example.com" label="Copy link" />
    //
    // Examples:
    //   <!-- Copy button with custom content and success callback -->
    //   <ClipboardCopyButton text={code} label="Copy code" onsuccess={handleCopied}>
    //     Copy to clipboard
    //   </ClipboardCopyButton>
    //
    // Keyboard:
    //   - Enter: Activate the copy button (native button behavior)
    //   - Space: Activate the copy button (native button behavior)
    //
    // Accessibility:
    //   - Implicit button role from the <button> element
    //   - aria-label describes the copy action for screen readers
    //   - data-copied attribute reflects "true" or "false" for CSS-based visual feedback
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //   - Button content is provided through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - The copied state auto-resets after 2 seconds via setTimeout
    //   - Consumer can use [data-copied="true"] CSS selector for feedback styling
    //
    // References:
    //   - Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        text,
        label,
        onsuccess = undefined,
        onerror = undefined,
        children = undefined,
        ...restProps
    }: {
        /** The text to copy to clipboard */
        text: string;
        /** Accessible label for the copy button */
        label: string;
        /** Callback on successful copy */
        onsuccess?: () => void;
        /** Callback on failed copy */
        onerror?: (error: unknown) => void;
        /** Optional button content (defaults to empty) */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    let copied = $state(false);

    async function handleClick() {
        try {
            await navigator.clipboard.writeText(text);
            copied = true;
            onsuccess?.();
            // Reset after a delay
            setTimeout(() => {
                copied = false;
            }, 2000);
        } catch (err) {
            onerror?.(err);
        }
    }
</script>

<!-- ClipboardCopyButton.svelte -->
<button
    class={`clipboard-copy-button ${className}`}
    type="button"
    aria-label={label}
    data-copied={copied}
    onclick={handleClick}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</button>
