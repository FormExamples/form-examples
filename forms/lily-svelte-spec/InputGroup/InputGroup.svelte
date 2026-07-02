<script lang="ts">
    // InputGroup component
    //
    // A headless group wrapping an input with optional prefix and suffix addons.
    // Renders a `<div role="group">` containing an optional prefix span, the
    // children (the input), and an optional suffix span. Useful for currency
    // symbols, units, search icons, copy buttons, and similar adornments.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, optional. aria-label for the group.
    //   prefix — Snippet, optional. Content rendered before the input.
    //   suffix — Snippet, optional. Content rendered after the input.
    //   children — Snippet, required. The input the consumer places inside.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <InputGroup label="Amount">
    //     {#snippet prefix()}<span>$</span>{/snippet}
    //     <input type="number" />
    //     {#snippet suffix()}<span>USD</span>{/snippet}
    //   </InputGroup>
    //
    // Examples:
    //   <InputGroup label="Search">
    //     {#snippet prefix()}<span aria-hidden="true">🔍</span>{/snippet}
    //     <input type="search" />
    //   </InputGroup>
    //
    // Keyboard:
    //   - Inherits keyboard behavior of the inner input
    //
    // Accessibility:
    //   - role="group" with aria-label communicates the grouping
    //   - Keep prefix/suffix decoration aria-hidden when redundant
    //
    // Internationalization:
    //   - Label and addon content come through props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - Sub-spans use `input-group-prefix` / `input-group-suffix` semantic class hooks
    //
    // References:
    //   - WAI-ARIA group: https://www.w3.org/TR/wai-aria-1.2/#group

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        prefix = undefined,
        suffix = undefined,
        children,
        ...restProps
    }: {
        /** Accessible label for the group */
        label?: string;
        /** Content before the input */
        prefix?: Snippet;
        /** Content after the input */
        suffix?: Snippet;
        /** The input element */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- InputGroup.svelte -->
<div
    class={`input-group ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {#if prefix}
        <span class="input-group-prefix">{@render prefix()}</span>
    {/if}
    {@render children?.()}
    {#if suffix}
        <span class="input-group-suffix">{@render suffix()}</span>
    {/if}
</div>
