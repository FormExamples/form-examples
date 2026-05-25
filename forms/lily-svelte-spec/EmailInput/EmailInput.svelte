<script lang="ts">
    // EmailInput component
    //
    // A headless email input wrapping a native <input type="email"> with accessible
    // labeling. Provides a streamlined API for basic email collection with required
    // and disabled state support.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Current email value; bindable.
    //   required — boolean, default false. Whether the field is required.
    //   disabled — boolean, default false. Whether the field is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <EmailInput label="Your email" bind:value />
    //
    // Examples:
    //   <!-- Basic email input -->
    //   <EmailInput label="Your email" bind:value />
    //
    //   <!-- Required email field -->
    //   <EmailInput label="Contact email" bind:value required />
    //
    // Keyboard:
    //   - None custom — keyboard behavior provided by the browser-native email input
    //
    // Accessibility:
    //   - aria-label provides the accessible name since no visible <label> is included
    //   - Native <input type="email"> provides built-in validation
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable() on value for two-way binding
    //
    // References:
    //   - MDN input type="email": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email

    let {
        class: className = "",
        label,
        value = $bindable(""),
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current value. Bindable. */
        value?: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<input
    class={`email-input ${className}`}
    type="email"
    aria-label={label}
    bind:value
    {required}
    {disabled}
    {...restProps}
/>
