<script lang="ts">
    // PasswordInput component
    //
    // A headless password field using the native HTML <input type="password">
    // element. The browser automatically obscures the entered text, protecting
    // sensitive data from onlookers. The component supports accessible labeling
    // via aria-label and two-way data binding through a bindable value prop.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Bindable password value; supports bind:value.
    //   autocomplete — string, default "current-password". Autocomplete hint.
    //   required — boolean, default false. Whether the field is required.
    //   disabled — boolean, default false. Whether the field is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <PasswordInput label="Password" bind:value />
    //
    // Examples:
    //   <!-- Login password field -->
    //   <PasswordInput label="Password" bind:value={password} required />
    //
    //   <!-- New password with autocomplete hint -->
    //   <PasswordInput label="New password" bind:value={newPassword} autocomplete="new-password" />
    //
    //   <!-- Disabled password field -->
    //   <PasswordInput label="Password" bind:value={password} disabled />
    //
    // Keyboard:
    //   - None beyond native input behavior -- standard text editing keys
    //
    // Accessibility:
    //   - aria-label={label} provides an accessible name since no visible <label> is included
    //   - Native <input type="password"> obscures entered text for privacy
    //   - The autocomplete attribute helps password managers and browsers fill credentials
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable() for two-way data binding on value
    //   - Consumer can add placeholder, maxlength, minlength, pattern via restProps
    //
    // References:
    //   - MDN input type="password": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password

    let {
        class: className = "",
        label,
        value = $bindable(""),
        autocomplete = "current-password",
        required = false,
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current value. Bindable. */
        value?: string;
        /** Autocomplete hint. */
        autocomplete?: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- PasswordInput.svelte -->
<input
    class={`password-input ${className}`}
    type="password"
    aria-label={label}
    bind:value
    {autocomplete}
    {required}
    {disabled}
    {...restProps}
/>
