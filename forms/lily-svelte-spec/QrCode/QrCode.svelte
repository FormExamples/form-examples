<script lang="ts">
    // QrCode component
    //
    // A headless container for displaying a QR code (two-dimensional barcode) that
    // encodes data such as URLs, text, contact information, or other machine-readable
    // content. It renders a <div> with role="img" and a required aria-label so screen
    // reader users understand what the QR code represents. The consumer provides the
    // actual QR code rendering (SVG, canvas, or third-party library output) as
    // children. Commonly used for sharing links, mobile payments, event check-ins,
    // and authentication workflows.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible description of the QR code content via aria-label.
    //   children — Snippet, required. QR code rendering (SVG, canvas, or other visual output).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <QrCode label="Scan to visit example.com">{qrSvg}</QrCode>
    //
    // Examples:
    //   <!-- QR code with SVG rendering -->
    //   <QrCode label="Scan to visit example.com">
    //     <svg><!-- QR code SVG paths --></svg>
    //   </QrCode>
    //
    //   <!-- QR code with canvas rendering -->
    //   <QrCode label="Scan to download the app">
    //     <canvas bind:this={qrCanvas}></canvas>
    //   </QrCode>
    //
    // Keyboard:
    //   None — this is a passive display container with no interactive behavior.
    //
    // Accessibility:
    //   - role="img" identifies the container as an image for assistive technologies
    //   - aria-label provides an accessible description of the encoded content
    //   - Screen reader users hear the label instead of seeing the visual barcode
    //
    // Internationalization:
    //   - The label prop is the only user-facing text; no hardcoded strings
    //   - Label should describe the encoded content, not "QR code" generically
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Do not generate QR code data — consumer provides the rendered QR content
    //   - The label should describe what scanning the code does, not just "QR code"
    //
    // References:
    //   - WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: { label: string; children: Snippet; [key: string]: unknown } = $props();
</script>

<!-- QrCode.svelte -->
<div
    class={`qr-code ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
