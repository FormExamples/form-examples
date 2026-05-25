<script lang="ts">
    // InputWithMask component
    //
    // A headless `<div>` wrapping a text input together with a decorative
    // mask display. The mask placeholder (e.g. `(___) ___-____`) is rendered
    // visually via a span with `aria-hidden="true"` so it does not pollute
    // the accessibility name; the input itself owns the REQUIRED `aria-label`.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the input.
    //   mask — string, REQUIRED. Format mask placeholder.
    //   value — string, default "". Input value.
    //   placeholder — string, optional. HTML placeholder.
    //   disabled — boolean, default false.
    //   oninput — (event: Event) => void, optional. Native input handler.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <InputWithMask label="Phone" mask="(___) ___-____" />
    //
    // Accessibility:
    //   - aria-label on the input names the field
    //   - The mask span is aria-hidden (decorative)
    //   - data-mask exposes the mask for consumer styling
    //
    // Internationalization:
    //   - Label and mask come from props (locale-aware mask is the consumer's job)
    //
    // Claude rules:
    //   - Headless: no styles
    //   - label and mask are REQUIRED

    let {
        class: className = "",
        label,
        mask,
        value = "",
        placeholder = undefined,
        disabled = false,
        oninput = undefined,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Accessible label for the input (REQUIRED) */
        label: string;
        /** Format mask placeholder (REQUIRED) */
        mask: string;
        /** Input value */
        value?: string;
        /** HTML placeholder */
        placeholder?: string;
        /** Whether the input is disabled */
        disabled?: boolean;
        /** Native input handler */
        oninput?: (event: Event) => void;
        [key: string]: unknown;
    } = $props();
</script>

<!-- InputWithMask.svelte -->
<div
    class={`input-with-mask ${className}`}
    data-mask={mask}
    {...restProps}
>
    <span class="input-with-mask-display" aria-hidden="true">{mask}</span>
    <input
        class="input-with-mask-control"
        type="text"
        aria-label={label}
        {value}
        {placeholder}
        {disabled}
        {oninput}
    />
</div>
