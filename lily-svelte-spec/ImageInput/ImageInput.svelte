<script lang="ts">
    // ImageInput component
    //
    // A headless image submit button using the native HTML <input type="image">
    // element. Displays an image that, when clicked within a form, submits the
    // form along with the click coordinates. This is a graphical alternative to
    // <input type="submit"> and is commonly used for custom submit buttons,
    // image maps, or graphical form controls.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   src — string, required. URL of the image to display.
    //   alt — string, required. Alternative text for accessibility.
    //   width — number | undefined, default undefined. Image width in pixels.
    //   height — number | undefined, default undefined. Image height in pixels.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <ImageInput src="/submit.png" alt="Submit form" />
    //
    // Examples:
    //   <!-- Image submit with dimensions -->
    //   <ImageInput src="/icons/go.png" alt="Go" width={32} height={32} />
    //
    //   <!-- Conditionally disabled image submit -->
    //   <ImageInput src="/submit.png" alt="Submit" disabled={!formValid} />
    //
    // Keyboard:
    //   - Enter: activates the image button (native behavior)
    //   - Space: activates the image button (native behavior)
    //
    // Accessibility:
    //   - The alt attribute provides the accessible name for the image button
    //   - Native <input type="image"> has an implicit button role
    //   - No additional ARIA attributes needed beyond native semantics
    //
    // Internationalization:
    //   - The alt prop externalizes the accessible name for translation
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - No children snippet -- uses image for visual content
    //
    // References:
    //   - MDN input type="image": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image

    let {
        class: className = "",
        src,
        alt,
        width = undefined,
        height = undefined,
        disabled = false,
        ...restProps
    }: {
        /** Image URL. */
        src: string;
        /** Alternative text. */
        alt: string;
        /** Image width in pixels. */
        width?: number;
        /** Image height in pixels. */
        height?: number;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ImageInput.svelte -->
<input
    class={`image-input ${className}`}
    type="image"
    {src}
    {alt}
    {width}
    {height}
    {disabled}
    {...restProps}
/>
