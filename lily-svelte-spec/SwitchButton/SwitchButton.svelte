<script lang="ts">
    // SwitchButton component
    //
    // A headless toggle switch that provides a binary on/off control using
    // role="switch" with aria-checked. It renders as a <button> element and
    // supports both click and keyboard (Space key) activation. Commonly used
    // for settings, preferences, and feature toggles where users need to
    // enable or disable a single option without submitting a form.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   checked — boolean, default false. Whether the switch is on; bindable with bind:checked.
    //   disabled — boolean, default false. Whether the switch is disabled.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <SwitchButton label="Enable notifications" bind:checked />
    //
    // Examples:
    //   <!-- Dark mode switch with conditional disabled -->
    //   <SwitchButton label="Dark mode" bind:checked={darkMode} disabled={locked} />
    //
    // Keyboard:
    //   - Space: toggles the switch between on and off states (custom handler with preventDefault)
    //   - Enter: activates the button (native button behavior)
    //
    // Accessibility:
    //   - role="switch" identifies the element as a two-state toggle switch
    //   - aria-checked={checked} communicates whether the switch is on or off
    //   - aria-label={label} provides the accessible name for the switch control
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses $bindable() for two-way data binding on checked prop
    //   - type="button" prevents accidental form submission
    //
    // References:
    //   - WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
    //   - WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch

    let {
        class: className = "",
        label,
        checked = $bindable(false),
        disabled = false,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Whether the switch is on. Bindable. */
        checked?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === " " && !disabled) {
            event.preventDefault();
            checked = !checked;
        }
    }
</script>

<!-- SwitchButton.svelte -->
<button
    class={`switch-button ${className}`}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    {disabled}
    onclick={() => {
        if (!disabled) checked = !checked;
    }}
    onkeydown={handleKeydown}
    {...restProps}
></button>
