<script lang="ts">
    // IconList component
    //
    // A headless `<ul>` that hosts a list of items each with a leading icon.
    // List semantics come from `<ul>`; an optional `aria-label` names the
    // list for assistive technology. Children are typically `IconListItem`
    // components.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, optional. aria-label naming the list.
    //   children — Snippet, required. Icon list items.
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // Syntax:
    //   <IconList label="Features">…</IconList>
    //
    // Accessibility:
    //   - <ul> conveys list semantics
    //   - Optional aria-label names the list
    //
    // Internationalization:
    //   - label is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no styles
    //
    // References:
    //   - USWDS Icon list: https://designsystem.digital.gov/components/icon-list/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Optional aria-label naming the list */
        label?: string;
        /** Icon list item children */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- IconList.svelte -->
<ul
    class={`icon-list ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ul>
