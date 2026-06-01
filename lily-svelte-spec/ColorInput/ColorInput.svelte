<script lang="ts">
    // ColorInput component
    //
    // A headless color input wrapping the native HTML <input type="color"> element.
    // It provides a browser-native color picker with accessible labelling via aria-label.
    // The value is always a hex color string (e.g., "#ff0000"). Useful in settings panels,
    // theme editors, or any interface where users need to select a color.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, default "#000000". Current hex color string; bindable via bind:value.
    //   label — string, required. Accessible name via aria-label.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   name — string, default undefined. Form field name.
    //   id — string, default undefined. Element ID.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <ColorInput label="Background color" bind:value={color} />
    //
    // Examples:
    //   <!-- Disabled color input with form name -->
    //   <ColorInput label="Text color" bind:value={textColor} disabled name="text_color" />
    //
    // Keyboard:
    //   - None — keyboard behavior is provided by the browser-native color input
    //
    // Accessibility:
    //   - aria-label provides an accessible name since native color inputs have no visible label
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Renders a bare <input type="color"> with no wrapper element
    //
    // References:
    //   - MDN <input type="color">: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color

    let {
        class: className = "",
        value = $bindable("#000000"),
        label,
        disabled = false,
        name = undefined,
        id = undefined,
        ...restProps
    }: {
        value?: string;
        label: string;
        disabled?: boolean;
        name?: string;
        id?: string;
        [key: string]: unknown;
    } = $props();
</script>

<input
    class={`color-input ${className}`}
    type="color"
    bind:value
    aria-label={label}
    {disabled}
    {name}
    {id}
    {...restProps}
/>
