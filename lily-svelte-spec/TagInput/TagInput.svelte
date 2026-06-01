<script lang="ts">
    // TagInput component
    //
    // A headless text input for adding tags to a collection. When the user types
    // a value and presses Enter, the component calls the onadd callback with the
    // trimmed text and automatically clears the input, providing a streamlined
    // tag entry experience. Commonly used alongside TagGroup for tag management
    // interfaces such as adding skills, keywords, or labels.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the input via aria-label.
    //   value — string, default "". Current input text; bindable with bind:value.
    //   onadd — (value: string) => void, optional. Callback fired when Enter is pressed with non-empty trimmed value.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <TagInput label="Add tag" bind:value onadd={(tag) => tags.push(tag)} />
    //
    // Examples:
    //   <!-- Tag input with add handler -->
    //   <TagInput label="Add skill" bind:value onadd={(skill) => skills = [...skills, skill]} />
    //
    // Keyboard:
    //   - Enter: when the input has a non-empty trimmed value, calls onadd and clears input
    //
    // Accessibility:
    //   - aria-label={label} provides an accessible name for the text input
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable("") for two-way binding on value
    //   - Enter handler calls preventDefault to avoid form submission
    //
    // References:
    //   - WAI-ARIA textbox role: https://www.w3.org/TR/wai-aria-1.2/#textbox

    let {
        class: className = "",
        label,
        value = $bindable(""),
        onadd,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current input value. Bindable. */
        value?: string;
        /** Callback when a tag is submitted. */
        onadd?: (value: string) => void;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Enter" && value.trim()) {
            event.preventDefault();
            onadd?.(value.trim());
            value = "";
        }
    }
</script>

<!-- TagInput.svelte -->
<input
    class={`tag-input ${className}`}
    type="text"
    aria-label={label}
    bind:value
    {onkeydown}
    {disabled}
    {...restProps}
/>
