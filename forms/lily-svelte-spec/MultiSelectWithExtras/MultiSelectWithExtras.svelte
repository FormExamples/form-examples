<script lang="ts">
    // MultiSelectWithExtras component
    //
    // A headless multiple-choice select with optional content before and after the
    // native <select multiple>, inside a wrapper <div>. Same shape as SelectWithExtras.
    //
    // Props:
    //   className — string, optional. CSS class on the wrapper.
    //   label — string, required. Accessible name via aria-label on the <select>.
    //   value — string[], default []. Bindable selected option values.
    //   size — number, optional. Number of visible rows.
    //   required, disabled — boolean, default false.
    //   children — Snippet. Option elements.
    //   before, after — Snippet, optional. Content around the select.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Keyboard:
    //   - Native only
    //
    // Accessibility:
    //   - aria-label={label} on the <select> provides the accessible name
    //
    // Claude rules:
    //   - Headless: no CSS; uses $bindable() on value
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
        before,
        after,
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
        /** Option elements. */
        children: Snippet;
        /** Content before the select. */
        before?: Snippet;
        /** Content after the select. */
        after?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "MultiSelectWithExtras",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- MultiSelectWithExtras.svelte -->
<div
    class={`multi-select-with-extras ${className}`}
    {...restProps}
>
    {#if before}
        {@render before()}
    {/if}
    <select
        multiple
        aria-label={label}
        {size}
        bind:value
        {required}
        {disabled}
    >
        {@render children?.()}
    </select>
    {#if after}
        {@render after()}
    {/if}
</div>
