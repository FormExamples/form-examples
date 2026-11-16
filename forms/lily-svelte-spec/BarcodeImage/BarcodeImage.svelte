<script lang="ts">
    // BarcodeImage component
    //
    // An image of a barcode (a patient wristband or a label, say). Renders an <img> with the `barcode-
    // image` hook; the component does not generate barcodes, the consumer supplies the image.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   src — string, required. The image URL.
    //   alt — string, required. The text alternative; for a barcode, say what it encodes in words.
    //   loading — "lazy" | "eager", optional. Passed to the native loading attribute.
    //   ...restProps — additional HTML attributes spread onto the root <img>.
    //
    // Syntax:
    //   <BarcodeImage src="…" alt="…" />
    //
    // Examples:
    //   <BarcodeImage src="/wristband.svg" alt="Barcode for patient identifier 123" />
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - `alt` is required: a barcode is unreadable to a screen reader, so the alternative carries the encoded value or its meaning
    //
    // Internationalization:
    //   - `alt` is consumer-supplied and should be translated
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Ships no barcode symbology; generation is the consumer's
    //
    // References:
    //   - MDN <img>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img

    let {
        class: className = "",
        src,
        alt,
        loading = undefined,
        ...restProps
    }: {
        src: string;
        alt: string;
        loading?: "lazy" | "eager";
        [key: string]: unknown;
    } = $props();
</script>

<!-- BarcodeImage.svelte -->
<img
    class={`barcode-image ${className}`}
    {src}
    {alt}
    {loading}
    {...restProps}
/>
