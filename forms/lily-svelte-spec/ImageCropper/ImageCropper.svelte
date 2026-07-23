<script lang="ts">
    // ImageCropper component
    //
    // A headless container for cropping and resizing an image to a selected region
    // using mouse, touch, or stylus input to move and resize a crop rectangle.
    // Renders a <div> with role="application" and an accessible label. Commonly used
    // in avatar and profile-photo editors, media upload workflows, document scanning,
    // and content management systems. The consumer provides the actual cropping
    // implementation (an HTML image with an overlay, a canvas, SVG resize handles,
    // or a third-party cropping library).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible description of the image cropper via aria-label.
    //   children — Snippet, required. The image and crop overlay surface.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ImageCropper label="Crop your profile photo">
    //     <img src="/uploads/photo.jpg" alt="Photo to crop" />
    //   </ImageCropper>
    //
    // Examples:
    //   <!-- Avatar upload flow -->
    //   <ImageCropper label="Crop your profile photo to a square">
    //     <img src={previewUrl} alt="Selected photo to crop" />
    //   </ImageCropper>
    //
    //   <!-- Document scan crop region -->
    //   <ImageCropper label="Adjust the crop region around the document">
    //     <canvas width="600" height="800"></canvas>
    //   </ImageCropper>
    //
    // Keyboard:
    //   - None — pointer- and keyboard-based crop interactions are handled by the consumer-provided overlay surface.
    //
    // Accessibility:
    //   - role="application" indicates a complex widget with custom pointer interactions
    //   - aria-label provides an accessible description of the image cropper purpose
    //   - Assistive technologies pass keyboard events through to the application
    //
    // Internationalization:
    //   - The label prop externalizes the accessible description for localization
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal cropping logic — consumer provides image/canvas/SVG implementation
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

<!-- ImageCropper.svelte -->
<div
    class={`image-cropper ${className}`}
    role="application"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
