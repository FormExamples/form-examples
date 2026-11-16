<script lang="ts">
    // MultiSelect component
    //
    // A headless multiple-choice select wrapping the native <select multiple>.
    // The value is an array of the selected option values.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string[], default []. Bindable selected option values.
    //   size — number, optional. Number of visible rows.
    //   required, disabled — boolean, default false.
    //   children — Snippet. Option elements.
    //   ...restProps — additional HTML attributes spread onto the <select>.
    //
    // Syntax:
    //   <MultiSelect label="Toppings" bind:value><Option value="a">A</Option></MultiSelect>
    //
    // Keyboard:
    //   - Native only: arrows move, Shift/Ctrl+arrows and Space extend/toggle selection
    //
    // Accessibility:
    //   - aria-label={label} provides the accessible name
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //
    // Claude rules:
    //   - Headless: no CSS; native keyboard only; uses $bindable() on value
    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        value = $bindable([]),
        size = undefined,
        required = false,
        disabled = false,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Selected option values. Bindable. */
        value?: string[];
        /** Number of visible rows. */
        size?: number;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
        /** Option elements to render inside. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "MultiSelect",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- MultiSelect.svelte -->
<select
    class={`multi-select ${className}`}
    multiple
    aria-label={label}
    {size}
    bind:value
    {required}
    {disabled}
    {...restProps}
>
    {@render children?.()}
</select>
