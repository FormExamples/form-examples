<script lang="ts">
    // SignaturePad component
    //
    // A headless container for capturing handwritten signatures using mouse, touch,
    // or stylus input. Renders a <div> with role="application" and an accessible
    // label. Commonly used in contract signing workflows, consent forms, delivery
    // confirmations, and legal document processing. The consumer provides the actual
    // drawing implementation (HTML canvas, SVG paths, or a third-party library).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible description of the signature field via aria-label.
    //   children — Snippet, required. Drawing surface (canvas, SVG, or other input mechanism).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <SignaturePad label="Sign here">
    //     <canvas width="400" height="200"></canvas>
    //   </SignaturePad>
    //
    // Examples:
    //   <!-- With terms acceptance context -->
    //   <SignaturePad label="Sign to accept terms">
    //     <canvas width="400" height="200"></canvas>
    //   </SignaturePad>
    //
    //   <!-- With SVG drawing surface -->
    //   <SignaturePad label="Your signature">
    //     <svg viewBox="0 0 400 200"><path d="" /></svg>
    //   </SignaturePad>
    //
    // Keyboard:
    //   - None — pointer-based interactions are handled by the consumer-provided drawing surface.
    //
    // Accessibility:
    //   - role="application" indicates a complex widget with custom pointer interactions
    //   - aria-label provides an accessible description of the signature pad purpose
    //   - Assistive technologies pass keyboard events through to the application
    //
    // Internationalization:
    //   - The label prop externalizes the accessible description for localization
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal drawing logic — consumer provides canvas/SVG implementation
    //   - role="application" is intentional for complex pointer interaction widgets
    //
    // References:
    //   - WAI-ARIA application role: https://www.w3.org/TR/wai-aria-1.2/#application
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: { label: string; children: Snippet; [key: string]: unknown } = $props();
</script>

<!-- SignaturePad.svelte -->
<div
    class={`signature-pad ${className}`}
    role="application"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
